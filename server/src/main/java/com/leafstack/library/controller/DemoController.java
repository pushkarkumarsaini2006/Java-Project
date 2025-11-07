package com.leafstack.library.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DemoController {

    @GetMapping("/demo")
    public Map<String, String> handleDemo() {
        return Map.of("message", "Hello from Spring Boot server");
    }
}