package com.sriae.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/health")
    public String health() {
        return "ok";
    }

    @GetMapping("/prueba")
    @PreAuthorize("isAuthenticated()")
    public String prueba() {
        return "Ruta protegida";
    }
}
