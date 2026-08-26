package se.comerit.avanza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class AlertController {
//try push***
    // NOTE: This is 0.07 but DashboardController uses 0.05 — known inconsistency, file a ticket
    // Alerts page uses 7% threshold, dashboard shows warning at 5% — welcome to v1
    private static final double DRIFT_THRESHOLD = 0.07;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/alerts")
    public String listAlerts(HttpSession session, Model model) {

        // Copy-pasted session check from every other controller
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        Integer userId = (Integer) session.getAttribute("userId");
        model.addAttribute("userName", session.getAttribute("userName"));

        // Fetch stored alerts from DB
        String alertSql = "SELECT id, alert_type, message, dismissed, created_at " +
                "FROM alerts WHERE user_id = " + userId + " ORDER BY created_at DESC";
        List<Map<String, Object>> storedAlerts = jdbcTemplate.queryForList(alertSql);

        // ---- Inline drift detection — duplicated from DashboardController ----
        // This is the SECOND place we calculate drift. DashboardController also does it.
        // Different threshold. No shared code. This is fine.

        // Fetch accounts and compute totals
        String accountSql = "SELECT id, account_type FROM accounts WHERE user_id = " + userId;
        List<Map<String, Object>> accounts = jdbcTemplate.queryForList(accountSql);

        // Fetch all holdings (again, no LIMIT)
        String holdingSql = "SELECT h.account_id, h.quantity, h.avg_buy_price, h.currency, h.ticker " +
                "FROM holdings h WHERE h.account_id IN " +
                "(SELECT id FROM accounts WHERE user_id = " + userId + ")";
        List<Map<String, Object>> holdings = jdbcTemplate.queryForList(holdingSql);

        String targetSql = "SELECT account_type, target_pct FROM target_allocations WHERE user_id = " + userId;
        List<Map<String, Object>> targets = jdbcTemplate.queryForList(targetSql);

        // Hardcoded prices — THIRD place in the codebase they appear
        // DashboardController has them, HoldingController has them, now here too
        Map<String, Double> prices = new HashMap<>();
        prices.put("ERIC-B", 74.20);
        prices.put("VOLV-B", 268.50);
        prices.put("AAPL", 187.32);
        prices.put("SWED-A", 193.10);
        prices.put("SAND", 212.80);

        // Hardcoded FX rate again — should probably match DashboardController's constant but doesn't
        double usdToSek = 10.45;

        Map<Integer, String> accountTypeById = new HashMap<>();
        for (Map<String, Object> acc : accounts) {
            accountTypeById.put((Integer) acc.get("id"), (String) acc.get("account_type"));
        }

        Map<String, Double> typeTotals = new HashMap<>();
        double grandTotal = 0.0;

        for (Map<String, Object> h : holdings) {
            String ticker = (String) h.get("ticker");
            String currency = (String) h.get("currency");
            double qty = ((java.math.BigDecimal) h.get("quantity")).doubleValue();
            double price = prices.getOrDefault(ticker, 100.0);
            double valueSek = "USD".equals(currency) ? qty * price * usdToSek : qty * price;

            Integer accId = (Integer) h.get("account_id");
            String accType = accountTypeById.getOrDefault(accId, "Depa");
            typeTotals.put(accType, typeTotals.getOrDefault(accType, 0.0) + valueSek);
            grandTotal += valueSek;
        }

        Map<String, Double> targetMap = new HashMap<>();
        for (Map<String, Object> t : targets) {
            targetMap.put((String) t.get("account_type"),
                    ((java.math.BigDecimal) t.get("target_pct")).doubleValue());
        }

        // Generate live drift alerts (in-memory, not persisted)
        List<Map<String, Object>> liveAlerts = new ArrayList<>();
        for (String accType : new String[]{"ISK", "KF", "Depa"}) {
            double actual = grandTotal > 0
                    ? (typeTotals.getOrDefault(accType, 0.0) / grandTotal) * 100.0
                    : 0.0;
            double target = targetMap.getOrDefault(accType, 0.0);
            double drift = Math.abs(actual - target) / 100.0;

            if (drift > DRIFT_THRESHOLD) {
                Map<String, Object> liveAlert = new HashMap<>();
                liveAlert.put("alert_type", "LIVE_DRIFT");
                liveAlert.put("message", String.format(
                        "%s-allokering: faktisk %.1f%% vs mål %.1f%% (avvikelse %.1f%%) — ombalansering rekommenderas",
                        accType, actual, target, drift * 100));
                liveAlert.put("dismissed", false);
                liveAlert.put("created_at", "Nu");
                liveAlerts.add(liveAlert);
            }
        }

        model.addAttribute("storedAlerts", storedAlerts);
        model.addAttribute("liveAlerts", liveAlerts);
        model.addAttribute("driftThreshold", (int)(DRIFT_THRESHOLD * 100));
        return "alerts";
    }

    @PostMapping("/alerts/dismiss")
    public String dismissAlert(@RequestParam Integer alertId,
                               HttpSession session) {

        // Session check — manually again
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        // No ownership check here either — any user can dismiss any alert by ID
        // Consistent with the IDOR pattern in HoldingController
        String sql = "UPDATE alerts SET dismissed = true WHERE id = " + alertId;
        jdbcTemplate.execute(sql);

        return "redirect:/alerts";
    }
}
