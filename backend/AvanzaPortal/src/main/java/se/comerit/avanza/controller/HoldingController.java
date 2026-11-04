package se.comerit.avanza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
>>>>>>> develop
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import se.comerit.avanza.dto.DailyPriceDto;
import se.comerit.avanza.service.AlphaVantageService;
import se.comerit.avanza.service.HoldingService;

import java.util.List;
import java.util.Map;

@Controller
public class HoldingController {

<<<<<<< HEAD
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/holdings")
    public String listHoldings(HttpSession session, Model model) {

        // Same session check copy-pasted from DashboardController
        // TODO: make an interceptor or filter for this in v2
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        Integer userId = (Integer) session.getAttribute("userId");
        model.addAttribute("userName", session.getAttribute("userName"));

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

        model.addAttribute("holdings", holdings);
        model.addAttribute("accounts", accounts);
=======
    private final HoldingService holdingService;
    private final AlphaVantageService alphaVantageService;

    public HoldingController(HoldingService holdingService, AlphaVantageService alphaVantageService) {
        this.holdingService = holdingService;
        this.alphaVantageService = alphaVantageService;
    }

    @GetMapping("/legacy/holdings")
    public String listHoldings(Model model) {


        // Read userId from SecurityContext (v2)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        // Logic moved to service layer
        Map<String, Object> data = holdingService.buildHoldingData(uid);

        model.addAttribute("holdings", data.get("holdings"));
        model.addAttribute("accounts",data.get("accounts"));
>>>>>>> develop
        return "holdings";
    }

    @PostMapping("/holdings/add")
    public String addHolding(@RequestParam Integer accountId,
                             @RequestParam String ticker,
                             @RequestParam String instrumentName,
                             @RequestParam String quantity,
                             @RequestParam String avgBuyPrice,
                             @RequestParam(defaultValue = "SEK") String currency,
<<<<<<< HEAD
                             HttpSession session,
                             Model model) {

        // Session check — again, manually, every time
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        // No input validation whatsoever — negative quantities? Strings as numbers? Sure, why not.
        // The database will throw an error if it's really wrong. Good enough.
        String sql = "INSERT INTO holdings (account_id, ticker, instrument_name, quantity, avg_buy_price, currency) " +
                "VALUES (" + accountId + ", '" + ticker.toUpperCase() + "', '" + instrumentName + "', " +
                quantity + ", " + avgBuyPrice + ", '" + currency + "')";

        jdbcTemplate.execute(sql);
=======
                             @RequestParam String assetCategory,
                             Model model) {

        // Read userId from SecurityContext (v2)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        // Add holding (userId not needed here yet, but available if needed later)
        holdingService.addHolding(accountId, ticker, instrumentName, quantity, avgBuyPrice, currency, assetCategory);
>>>>>>> develop

        return "redirect:/holdings";
    }

    @PostMapping("/holdings/delete")
<<<<<<< HEAD
    public String deleteHolding(@RequestParam Integer holdingId,
                                HttpSession session) {

        // Session check
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        // IDOR VULNERABILITY: No ownership check — any logged-in user can delete any holding
        // We just delete by holdingId directly without verifying it belongs to this user
        // TODO: add WHERE account_id IN (SELECT id FROM accounts WHERE user_id = ?) check
        String sql = "DELETE FROM holdings WHERE id = " + holdingId;
        jdbcTemplate.execute(sql);

        return "redirect:/holdings";
    }
=======
    public String deleteHolding(@RequestParam Integer holdingId) {


        // Read userId from SecurityContext (v2)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        // Pass userId for IDOR protection
        holdingService.deleteHolding(holdingId, uid);

        return "redirect:/holdings";
    }
    @GetMapping("/api/holdings")
    public ResponseEntity<?> apiHoldings() {

        // Read userId from JWT (SecurityContext)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        // Fetch holdings for logged-in user
        Map<String, Object> data = holdingService.buildHoldingData(uid);

        return ResponseEntity.ok(data);
    }

    // --- NY ENDPOINT FÖR HISTORIK ---
    @GetMapping("/api/holdings/history")
    public ResponseEntity<List<DailyPriceDto>> getHoldingHistory(
            @RequestParam String ticker,
            @RequestParam(defaultValue = "1Y") String range) {

        List<DailyPriceDto> history = alphaVantageService.getHistoryForRange(ticker, range);
        return ResponseEntity.ok(history);
    }
}


