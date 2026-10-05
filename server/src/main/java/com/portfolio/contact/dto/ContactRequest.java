package com.portfolio.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 문의 접수 요청 DTO (controller ↔ service) */
public record ContactRequest(
    @NotBlank(message = "이름을 입력하세요.") @Size(max = 50) String name,
    @NotBlank(message = "이메일을 입력하세요.") @Email(message = "올바른 이메일이 아닙니다.") String email,
    @NotBlank(message = "메시지를 입력하세요.") @Size(max = 5000) String message) {}
