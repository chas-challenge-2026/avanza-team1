package se.comerit.avanza.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import se.comerit.avanza.service.AlertService;
import java.util.Map;

@Controller
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/alerts")
    public String listAlerts(Model model) {

        // Read userId from SecurityContext (v2)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        Map<String, Object> alerts = alertService.getAlerts(uid);

        model.addAttribute("storedAlerts", alerts.get("storedAlerts"));
        model.addAttribute("liveAlerts", alerts.get("liveAlerts"));
        model.addAttribute("driftThreshold", alerts.get("driftThreshold"));
        return "alerts";
    }

    @PostMapping("/alerts/dismiss")
    public String dismissAlert(@RequestParam Integer alertId) {


        // Read userId from SecurityContext (v2)
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        // Pass userId for IDOR protection
        alertService.dismissAlert(alertId, uid);

        return "redirect:/alerts";
    }
    @GetMapping("/api/alerts")
    public ResponseEntity<?> apiAlerts() {

        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        Long uid = Long.valueOf(userId);

        Map<String, Object> alerts = alertService.getAlerts(uid);

        return ResponseEntity.ok(alerts);
    }

}
