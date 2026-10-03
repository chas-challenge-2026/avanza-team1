package se.comerit.avanza.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PortfolioService {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private AlertService alertService;  // ← DENNA här för att spara alerts

    private static final double USD_TO_SEK = 10.5; // Example exchange rate or loaded configuration
    private static final double DRIFT_THRESHOLD = 0.05; // 5% drift threshold

    public Map<String, Object> buildDashboardData(Long userId) {

        // ---- Query 1: Get all accounts for user ----
        String accountsSql = "SELECT id, account_type, account_name, currency FROM accounts WHERE user_id = ?";
        List<Map<String, Object>> accounts = jdbcTemplate.queryForList(accountsSql, userId);

        // ---- Query 2: Get ALL holdings ----
        String holdingsSql = "SELECT h.id, h.account_id, h.ticker, h.instrument_name, h.quantity, " +
                "h.avg_buy_price, h.currency, h.asset_category " +
                "FROM holdings h " +
                "WHERE h.account_id IN (SELECT id FROM accounts WHERE user_id = ?)";
        List<Map<String, Object>> holdings = jdbcTemplate.queryForList(holdingsSql, userId);

        // ---- Query 3: Get target allocations per asset_category ----
        String targetsSql = "SELECT asset_category, target_pct FROM target_allocations WHERE user_id = ?";
        List<Map<String, Object>> targets = jdbcTemplate.queryForList(targetsSql, userId);

        // ---- Query 4: Get recent alerts ----
        String alertsSql = "SELECT id, alert_type, message, created_at FROM alerts " +
                "WHERE user_id = ? AND dismissed = false ORDER BY created_at DESC";
        List<Map<String, Object>> recentAlerts = jdbcTemplate.queryForList(alertsSql, userId);

        // ---- Prices Setup ----
        Map<String, Double> currentPrices = getMockPrices();

        // ---- Enrich Holdings & Calculate Totals per Asset Category ----
        double totalPortfolioValue = 0.0;
        Map<String, Double> categoryTotals = new HashMap<>();
        Map<String, Double> accountTypeTotals = new HashMap<>();
        List<Map<String, Object>> enrichedHoldings = new ArrayList<>();

        // Map account IDs to account types for summary
        Map<Integer, String> accountTypeById = new HashMap<>();
        for (Map<String, Object> acc : accounts) {
            accountTypeById.put((Integer) acc.get("id"), (String) acc.get("account_type"));
        }

        for (Map<String, Object> h : holdings) {
            String ticker = (String) h.get("ticker");
            String currency = (String) h.get("currency");
            String assetCategory = (String) h.getOrDefault("asset_category", "Uncategorized");

            double quantity = ((BigDecimal) h.get("quantity")).doubleValue();
            double avgBuy = ((BigDecimal) h.get("avg_buy_price")).doubleValue();
            double price = currentPrices.getOrDefault(ticker, currentPrices.get("DEFAULT"));

            double valueSek = "USD".equals(currency) ? quantity * price * USD_TO_SEK : quantity * price;
            double costBasis = quantity * avgBuy * ("USD".equals(currency) ? USD_TO_SEK : 1.0);
            double unrealizedReturn = valueSek - costBasis;
            double unrealizedReturnPct = costBasis > 0 ? (unrealizedReturn / costBasis) * 100 : 0;
            double sharpe = (unrealizedReturnPct / 100 - 0.02) / 0.15;

            Map<String, Object> enriched = new HashMap<>(h);
            enriched.put("currentPrice", price);
            enriched.put("valueSek", Math.round(valueSek * 100.0) / 100.0);
            enriched.put("unrealizedReturn", Math.round(unrealizedReturn * 100.0) / 100.0);
            enriched.put("unrealizedReturnPct", Math.round(unrealizedReturnPct * 100.0) / 100.0);
            enriched.put("sharpe", Math.round(sharpe * 100.0) / 100.0);
            enriched.put("displayCurrency", "USD".equals(currency) ? "USD->SEK" : "SEK");

            enrichedHoldings.add(enriched);

            // Accumulate total portfolio value and category values
            totalPortfolioValue += valueSek;
            categoryTotals.put(assetCategory, categoryTotals.getOrDefault(assetCategory, 0.0) + valueSek);

            // Accumulate totals per account type
            Integer accId = (Integer) h.get("account_id");
            String accType = accountTypeById.getOrDefault(accId, "Depa");
            accountTypeTotals.put(accType, accountTypeTotals.getOrDefault(accType, 0.0) + valueSek);
        }

        // ---- Drift Detection by Asset Category ----
        Map<String, Double> targetMap = new HashMap<>();
        for (Map<String, Object> t : targets) {
            String cat = (String) t.get("asset_category");
            double targetPct = ((BigDecimal) t.get("target_pct")).doubleValue();
            targetMap.put(cat, targetPct);
        }

        List<Map<String, Object>> allocationRows = new ArrayList<>();
        boolean anyDrift = false;

        // Collect all categories (both from targets and current holdings)
        Set<String> allCategories = new HashSet<>(targetMap.keySet());
        allCategories.addAll(categoryTotals.keySet());

        for (String category : allCategories) {
            double categoryVal = categoryTotals.getOrDefault(category, 0.0);
            double actualPct = totalPortfolioValue > 0 ? (categoryVal / totalPortfolioValue) * 100.0 : 0.0;
            double targetPct = targetMap.getOrDefault(category, 0.0);
            double driftPct = actualPct - targetPct;
            double drift = Math.abs(actualPct - targetPct) / 100.0;

            boolean overThreshold = Math.abs(driftPct /100.0) > DRIFT_THRESHOLD;

            //I loopen där du beräknar drift per assetCategory:
            if (overThreshold) {
                anyDrift = true;

                // Bygg dynamiskt varningsmeddelande baserat på asset_category
                String alertMessage = String.format(Locale.US,
                        "%s-allokering avviker %.2f%% (mål %.2f%%, aktuell %.2f%% ",
                        category, // t.ex. "Aktier"
                       driftPct,
                        targetPct,
                        actualPct
                );

                // Skapa ett temporärt alert-objekt eller spara till databasen
                Map<String, Object> dynamicAlert = new HashMap<>();
                dynamicAlert.put("alert_type", "DRIFT");
                dynamicAlert.put("message", alertMessage);

                // Lägg till i listan över aktiva alerts för dashboarden
                recentAlerts.add(dynamicAlert);
                // ✅ SPARA I DB
                alertService.saveAlert(userId, "DRIFT", alertMessage);
            }


            Map<String, Object> row = new HashMap<>();
            row.put("assetCategory", category);
            row.put("actual", Math.round(actualPct * 100.0) / 100.0);
            row.put("target", targetPct);
            row.put("drift", Math.round(drift * 10000.0) / 100.0);
            row.put("overThreshold", overThreshold);

            allocationRows.add(row);
        }

        // ---- Account Summary ----
        List<Map<String, Object>> accountSummary = new ArrayList<>();
        for (Map<String, Object> acc : accounts) {
            String accType = (String) acc.get("account_type");
            double total = accountTypeTotals.getOrDefault(accType, 0.0);

            Map<String, Object> summary = new HashMap<>();
            summary.put("accountId", acc.get("id"));
            summary.put("accountType", accType);
            summary.put("totalValueSek", Math.round(total * 100.0) / 100.0);
            accountSummary.add(summary);
        }

        // ---- Construct Result Map ----
        Map<String, Object> result = new HashMap<>();
        result.put("accounts", accountSummary);
        result.put("holdings", enrichedHoldings);
        result.put("allocationRows", allocationRows);
        result.put("totalPortfolioValue", Math.round(totalPortfolioValue * 100.0) / 100.0);
        result.put("recentAlerts", recentAlerts);
        result.put("anyDrift", anyDrift);
        result.put("usdToSek", USD_TO_SEK);

        return result;
    }

    private Map<String, Double> getMockPrices() {
        Map<String, Double> currentPrices = new HashMap<>();
        currentPrices.put("ERIC-B", 74.20);
        currentPrices.put("VOLV-B", 268.50);
        currentPrices.put("AAPL", 187.32);
        currentPrices.put("SWED-A", 193.10);
        currentPrices.put("SAND", 212.80);
        currentPrices.put("DEFAULT", 100.0);
        return currentPrices;
    }
}
