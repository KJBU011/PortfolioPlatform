package com.portfolio.linkcheck.dto;

/** 데모 URL 생존 확인 결과 DTO */
public record LinkCheckResult(String url, boolean ok, int status) {}
