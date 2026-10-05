package com.portfolio.linkcheck.service;

import com.portfolio.linkcheck.dto.LinkCheckResult;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import org.springframework.stereotype.Service;

/** 외부 데모 URL에 HEAD 요청을 보내 생존 확인 (5초 타임아웃) */
@Service
public class LinkCheckService {

  public LinkCheckResult check(String url) {
    URI uri;
    try {
      uri = URI.create(url);
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("올바른 URL이 아닙니다.");
    }
    String scheme = uri.getScheme();
    if (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme)) {
      throw new IllegalArgumentException("http/https URL만 확인할 수 있습니다.");
    }
    int status = -1;
    try {
      HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection();
      conn.setRequestMethod("HEAD");
      conn.setConnectTimeout(5000);
      conn.setReadTimeout(5000);
      conn.setInstanceFollowRedirects(true);
      conn.setRequestProperty("User-Agent", "portfolio-link-check/0.1");
      status = conn.getResponseCode();
      conn.disconnect();
    } catch (IOException e) {
      return new LinkCheckResult(url, false, -1);
    }
    return new LinkCheckResult(url, status >= 200 && status < 400, status);
  }
}
