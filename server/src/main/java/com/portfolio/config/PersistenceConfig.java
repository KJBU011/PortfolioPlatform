package com.portfolio.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

/**
 * spring.datasource.url이 있을 때만 DB 스택 활성화.
 * 없으면 DataSource/MyBatis 없이 부팅 (contact는 로그 적재).
 * (메인 앱에서 DataSourceAutoConfiguration을 exclude하므로 여기서 직접 생성)
 */
@Configuration
@Conditional(DbUrlCondition.class)
@MapperScan("com.portfolio.contact.dao")
public class PersistenceConfig {

  @Bean
  public DataSource dataSource(
      @Value("${spring.datasource.url}") String url,
      @Value("${spring.datasource.username:}") String username,
      @Value("${spring.datasource.password:}") String password) {
    HikariDataSource ds = new HikariDataSource();
    ds.setJdbcUrl(url);
    ds.setUsername(username);
    ds.setPassword(password);
    return ds;
  }

  @Bean
  public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
    SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
    factory.setDataSource(dataSource);
    factory.setMapperLocations(
        new PathMatchingResourcePatternResolver().getResources("classpath:mappers/*.xml"));
    factory.setTypeAliasesPackage("com.portfolio.contact.dto,com.portfolio.linkcheck.dto");
    org.apache.ibatis.session.Configuration configuration =
        new org.apache.ibatis.session.Configuration();
    configuration.setMapUnderscoreToCamelCase(true);
    factory.setConfiguration(configuration);
    return factory.getObject();
  }
}
