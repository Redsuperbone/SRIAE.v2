package com.sriae;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SriaeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SriaeBackendApplication.class, args);
	}

}
