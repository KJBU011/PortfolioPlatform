package com.portfolio.common;

import java.time.Instant;

/** 공용 API 응답 래퍼 */
public record ApiResponse<T>(boolean ok, T data, String message, Instant at) {
  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(true, data, null, Instant.now());
  }

  public static <T> ApiResponse<T> ok(T data, String message) {
    return new ApiResponse<>(true, data, message, Instant.now());
  }

  public static <T> ApiResponse<T> fail(String message) {
    return new ApiResponse<>(false, null, message, Instant.now());
  }
}
