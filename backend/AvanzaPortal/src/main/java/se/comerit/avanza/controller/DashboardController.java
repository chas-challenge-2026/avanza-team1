package se.comerit.avanza.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import se.comerit.avanza.service.PortfolioService;
import java.util.Map;

@Controller
public class DashboardController {

    private final PortfolioService portfolioService;

    public DashboardController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/")
    public String dashboard(HttpServletRequest request, Model model) {

        Long userId = (Long) request.getAttribute("userId");

        // Flyttad logik — nu i service
        Map<String, Object> data = portfolioService.buildDashboardData(userId);

        // Lägg in allt i model (exakt som v1)
        model.addAttribute("accounts", data.get("accounts"));
        model.addAttribute("holdings", data.get("holdings"));
        model.addAttribute("allocationRows", data.get("allocationRows"));
        model.addAttribute("totalPortfolioValue", data.get("totalPortfolioValue"));
        model.addAttribute("recentAlerts", data.get("recentAlerts"));
        model.addAttribute("anyDrift", data.get("anyDrift"));
        model.addAttribute("usdToSek", data.get("usdToSek"));

        return "dashboard";
    }
}





