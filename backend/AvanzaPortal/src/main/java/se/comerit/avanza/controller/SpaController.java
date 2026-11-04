package se.comerit.avanza.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    /**
     * Vidarebefordrar klientsidans React Router-rutter till index.html.
     * Detta förhindrar 404/401 när användaren laddar om sidan (F5) eller navigerar direkt.
     */
    @GetMapping({"/login", "/holdings", "/alerts"})
    public String serveReact() {
        return "forward:/index.html";
    }
}