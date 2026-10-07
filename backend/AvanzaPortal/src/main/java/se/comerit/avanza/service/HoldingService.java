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

    public Map<String, Object> buildHoldingData(Long userId) {
    // Fetch all holdings — no pagination, no LIMIT
    // This will load all rows into memory. Fine for small datasets. Definitely fine.
    String sql = "SELECT h.id, h.ticker, h.instrument_name, h.quantity, h.avg_buy_price, " +
            "h.currency, h.asset_category, a.account_type, a.account_name " +
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
                           String quantity, String avgBuyPrice, String currency,
                           String assetCategory) {

        // No input validation whatsoever — negative quantities? Strings as numbers? Sure, why not.
        // The database will throw an error if it's really wrong. Good enough.
        // Använd parametrized SQL för att undvika SQL-injection
        String sql = """
            
                INSERT INTO holdings (account_id, ticker, instrument_name, quantity, avg_buy_price, currency, asset_category)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;

            try {
                double qty = Double.parseDouble(quantity);
                double price = Double.parseDouble(avgBuyPrice);

                if (qty <= 0 || price <= 0) {
                    throw new IllegalArgumentException("Quantity och price måste vara större än 0");
                }

                // Validera asset_category
                validateAssetCategory(assetCategory);

                jdbcTemplate.update(sql, accountId, ticker.toUpperCase(), instrumentName,
                        qty, price, currency.toUpperCase(), assetCategory.toUpperCase());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Quantity och avgBuyPrice måste vara giltiga nummer", e);
            }

}

    // IDOR — Innehav (Insecure Direct Object Reference)
    // Problem: DELETE FROM holdings WHERE id = ? utan att verifiera att innehavet tillhör inloggad användare.
    // Valfri inloggad användare kan ta bort andras innehav.
    // Fix: Lägg till AND account_id IN (SELECT id FROM accounts WHERE user_id = ?).

    public void deleteHolding(Integer holdingId, Long sessionUserId) {

        String sql = """
        DELETE FROM holdings
        WHERE id = ?
        AND account_id IN (
            SELECT id FROM accounts WHERE user_id = ?
        )
    """;

        // Endast ägaren kan radera sin holding.
        // Fel användare → inget händer (IDOR blockeras).
        jdbcTemplate.update(sql, holdingId, sessionUserId);
    }

/**
 * Validera att asset_category är ett giltigt värde
 */
        private void validateAssetCategory(String assetCategory){
            if (assetCategory == null || assetCategory.trim().isEmpty()) {
                throw new IllegalArgumentException("asset_category kan inte vara tom");
            }

            String upper = assetCategory.toUpperCase();
            if (!upper.equals("EQUITY") && !upper.equals("STABLE") &&
                    !upper.equals("CASH") && !upper.equals("ALTERNATIVES")) {
                throw new IllegalArgumentException(
                        "Ogiltig asset_category: " + assetCategory +
                                ". Giltiga värden: EQUITY, STABLE, CASH, ALTERNATIVES");
            }
        }

}
