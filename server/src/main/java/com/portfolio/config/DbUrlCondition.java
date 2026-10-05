package com.portfolio.config;

import org.springframework.boot.autoconfigure.condition.ConditionOutcome;
import org.springframework.boot.autoconfigure.condition.SpringBootCondition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

/** spring.datasource.url이 실제 값일 때만 매치 (빈 문자열/플레이스홀더 제외) */
public class DbUrlCondition extends SpringBootCondition {
  @Override
  public ConditionOutcome getMatchOutcome(
      ConditionContext context, AnnotatedTypeMetadata metadata) {
    String url = context.getEnvironment().getProperty("spring.datasource.url");
    if (url != null && !url.isBlank() && !url.contains("#{")) {
      return ConditionOutcome.match("spring.datasource.url present");
    }
    return ConditionOutcome.noMatch("spring.datasource.url absent");
  }
}
