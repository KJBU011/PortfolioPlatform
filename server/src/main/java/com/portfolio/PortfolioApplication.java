package com.portfolio;

import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(
    exclude = {
      // DB는 spring.datasource.url이 있을 때 PersistenceConfig에서 수동 활성화
      DataSourceAutoConfiguration.class,
      MybatisAutoConfiguration.class
    })
public class PortfolioApplication {
  public static void main(String[] args) {
    SpringApplication.run(PortfolioApplication.class, args);
  }
}
