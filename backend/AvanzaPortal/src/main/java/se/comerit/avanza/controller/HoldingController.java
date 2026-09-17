package se.comerit.avanza.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import se.comerit.avanza.service.HoldingService;
import java.util.Map;

@Controller
public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping("/holdings")
    public String listHoldings(HttpServletRequest request, Model model) {


        Long userId = (Long) request.getAttribute("userId");

        //  Flyttad logik — nu i service
        Map<String, Object> data = holdingService.buildHoldingData(userId);

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
                             HttpServletRequest request,
                             Model model) {
        Long userId = (Long) request.getAttribute("userId");
        holdingService.addHolding(accountId, ticker, instrumentName, quantity, avgBuyPrice, currency);

        return "redirect:/holdings";
    }

    @PostMapping("/holdings/delete")
    public String deleteHolding(@RequestParam Integer holdingId,
                                HttpServletRequest request) {


        Long userId = (Long) request.getAttribute("userId");

        // Skicka userId till service för IDOR‑kontroll
        holdingService.deleteHolding(holdingId, userId);

        return "redirect:/holdings";
    }
}
