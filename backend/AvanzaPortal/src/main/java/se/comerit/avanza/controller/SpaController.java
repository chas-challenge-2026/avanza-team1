package se.comerit.avanza.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    /**
     * Vidarebefordrar alla klientsidiga React Router-rutter till index.html.
     * Detta gör att direktlänkar och siduppdateringar i webbläsaren fungerar utan 404.
     */
    @GetMapping({"/login", "/holdings", "/alerts"})
    public String serveReact() {
        return "forward:/index.html";
    }
}