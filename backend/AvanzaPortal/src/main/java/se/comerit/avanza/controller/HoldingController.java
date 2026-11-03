package se.comerit.avanza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private final HoldingService holdingService;
    private final AlphaVantageService alphaVantageService;

    public HoldingController(HoldingService holdingService, AlphaVantageService alphaVantageService) {
        this.holdingService = holdingService;
        this.alphaVantageService = alphaVantageService;
    }

    @GetMapping("/holdings")
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
        return "holdings";
    }

    @PostMapping("/holdings/add")
    public String addHolding(@RequestParam Integer accountId,
                             @RequestParam String ticker,
                             @RequestParam String instrumentName,
                             @RequestParam String quantity,
                             @RequestParam String avgBuyPrice,
                             @RequestParam(defaultValue = "SEK") String currency,
                             @RequestParam String assetCategory,
                             Model model) {

        // Read userId from SecurityContext (v2)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        // Add holding (userId not needed here yet, but available if needed later)
        holdingService.addHolding(accountId, ticker, instrumentName, quantity, avgBuyPrice, currency, assetCategory);

        return "redirect:/holdings";
    }

    @PostMapping("/holdings/delete")
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


