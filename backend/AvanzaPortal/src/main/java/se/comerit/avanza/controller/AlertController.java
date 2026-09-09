package se.comerit.avanza.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import se.comerit.avanza.service.AlertService;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping("/alerts")
    public String listAlerts(HttpSession session, Model model) {

        // Copy-pasted session check from every other controller
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        Integer userId = (Integer) session.getAttribute("userId");
        model.addAttribute("userName", session.getAttribute("userName"));

        Map<String, Object> alerts = alertService.getAlerts(userId);

        model.addAttribute("storedAlerts", alerts.get("storedAlerts"));
        model.addAttribute("liveAlerts", alerts.get("liveAlerts"));
        model.addAttribute("driftThreshold", alerts.get("driftThreshold"));
        return "alerts";
    }

    @PostMapping("/alerts/dismiss")
    public String dismissAlert(@RequestParam Integer alertId,
                               HttpSession session) {

        // Session check — manually again
        if (session.getAttribute("userId") == null) {
            return "redirect:/login";
        }

        alertService.dismissAlert(alertId);
        return "redirect:/alerts";
    }
}
