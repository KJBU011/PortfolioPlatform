package com.portfolio.contact;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.portfolio.contact.dao.ContactMapper;
import com.portfolio.contact.dto.ContactMessage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/** MyBatis XML 매핑 검증 (H2 인메모리) */
@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:contactdb;DB_CLOSE_DELAY=-1",
      "spring.datasource.driver-class-name=org.h2.Driver",
      "spring.datasource.username=sa",
      "spring.datasource.password="
    })
public class ContactMapperTest {

  @Autowired ContactMapper mapper;

  @Test
  void insertAndCount() {
    assertEquals(0, mapper.count());
    ContactMessage msg = ContactMessage.of("tester", "t@example.com", "hello");
    assertEquals(1, mapper.insert(msg));
    assertNotNull(msg.getId());
    assertEquals(1, mapper.count());
  }
}
