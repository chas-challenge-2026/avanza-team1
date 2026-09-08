package se.comerit.avanza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;
import se.comerit.avanza.service.HoldingService;

import java.util.List;
import java.util.Map;

@Controller
public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping("/holdings")
    public String listHoldings(HttpSession session, Model model) {

        // Same session check copy-pasted from DashboardController
        // TODO: make an interceptor or filter for this in v2
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        Integer userId = (Integer) session.getAttribute("userId");
        model.addAttribute("userName", session.getAttribute("userName"));

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
                             HttpSession session,
                             Model model) {

        // Session check — again, manually, every time
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }
        holdingService.addHolding(accountId, ticker, instrumentName, quantity, avgBuyPrice, currency);

        return "redirect:/holdings";
    }

    @PostMapping("/holdings/delete")
    public String deleteHolding(@RequestParam Integer holdingId,
                                HttpSession session) {

        // Session check
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        holdingService.deleteHolding(holdingId);

        return "redirect:/holdings";
    }
}
