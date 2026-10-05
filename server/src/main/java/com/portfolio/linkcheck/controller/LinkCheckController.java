package com.portfolio.linkcheck.controller;

import com.portfolio.common.ApiResponse;
import com.portfolio.linkcheck.service.LinkCheckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** 외부 데모 URL 생존 확인 (죽은 링크 감지용) */
@RestController
@RequestMapping("/api/demo-links")
public class LinkCheckController {

  private final LinkCheckService linkCheckService;

  public LinkCheckController(LinkCheckService linkCheckService) {
    this.linkCheckService = linkCheckService;
  }

  @GetMapping("/check")
  public ResponseEntity<ApiResponse<?>> check(@RequestParam String url) {
    return ResponseEntity.ok(ApiResponse.ok(linkCheckService.check(url)));
  }
}
