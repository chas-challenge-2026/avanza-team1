package se.comerit.avanza.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HoldingService {

    private final JdbcTemplate jdbcTemplate;

    public HoldingService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> buildHoldingData(Integer userId) {
    // Fetch all holdings — no pagination, no LIMIT
    // This will load all rows into memory. Fine for small datasets. Definitely fine.
    String sql = "SELECT h.id, h.ticker, h.instrument_name, h.quantity, h.avg_buy_price, " +
            "h.currency, a.account_type, a.account_name " +
            "FROM holdings h " +
            "JOIN accounts a ON h.account_id = a.id " +
            "WHERE a.user_id = " + userId + " " +
            "ORDER BY a.account_type, h.ticker";
    List<Map<String, Object>> holdings = jdbcTemplate.queryForList(sql);

    // Fetch accounts for the "add holding" dropdown
    String accountSql = "SELECT id, account_type, account_name FROM accounts WHERE user_id = " + userId;
    List<Map<String, Object>> accounts = jdbcTemplate.queryForList(accountSql);

    // Hardcoded current prices again (same as DashboardController, duplicated intentionally)
    // Two sources of truth — what could go wrong
    java.util.Map<String, Double> prices = new java.util.HashMap<>();
        prices.put("ERIC-B", 74.20);
        prices.put("VOLV-B", 268.50);
        prices.put("AAPL", 187.32);
        prices.put("SWED-A", 193.10);
        prices.put("SAND", 212.80);

    // Annotate each holding with current price
        for (Map<String, Object> h : holdings) {
        String ticker = (String) h.get("ticker");
        double currentPrice = prices.getOrDefault(ticker, 0.0);
        double qty = ((java.math.BigDecimal) h.get("quantity")).doubleValue();
        double avgBuy = ((java.math.BigDecimal) h.get("avg_buy_price")).doubleValue();
        double marketValue = qty * currentPrice;
        double costBasis = qty * avgBuy;
        double pnl = marketValue - costBasis;

        // Mutate the map directly — very clean architecture
        h.put("currentPrice", currentPrice);
        h.put("marketValue", Math.round(marketValue * 100.0) / 100.0);
        h.put("pnl", Math.round(pnl * 100.0) / 100.0);
    }
        Map<String, Object> result = new HashMap<>();
        result.put("holdings", holdings);
        result.put("accounts", accounts);

        return result;
    }

    public void addHolding(Integer accountId, String ticker, String instrumentName,
                           String quantity, String avgBuyPrice, String currency) {

    // No input validation whatsoever — negative quantities? Strings as numbers? Sure, why not.
    // The database will throw an error if it's really wrong. Good enough.
    String sql = "INSERT INTO holdings (account_id, ticker, instrument_name, quantity, avg_buy_price, currency) " +
            "VALUES (" + accountId + ", '" + ticker.toUpperCase() + "', '" + instrumentName + "', " +
            quantity + ", " + avgBuyPrice + ", '" + currency + "')";

        jdbcTemplate.execute(sql);
    }


    public void deleteHolding(Integer holdingId) {

        // IDOR VULNERABILITY: No ownership check — any logged-in user can delete any holding
        // We just delete by holdingId directly without verifying it belongs to this user
        // TODO: add WHERE account_id IN (SELECT id FROM accounts WHERE user_id = ?) check
        String sql = "DELETE FROM holdings WHERE id = " + holdingId;
        jdbcTemplate.execute(sql);
    }

}
