package com.portfolio.contact.service;

import com.portfolio.contact.dao.ContactMapper;
import com.portfolio.contact.dto.ContactMessage;
import com.portfolio.contact.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * 문의 처리: DB(contact_message) 적재 + 메일 발송.
 * DB 미설정(mapper 없음) → 로그만, 메일 미설정 → 발송 생략.
 */
@Service
public class ContactService {
  private static final Logger log = LoggerFactory.getLogger(ContactService.class);

  private final JavaMailSender mailSender;
  private ContactMapper contactMapper;

  @Value("${app.contact.to:}")
  private String to;

  @Autowired(required = false)
  public ContactService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  /** DB 스택이 있을 때만 주입됨 (없으면 null 유지) */
  @Autowired(required = false)
  public void setContactMapper(ContactMapper contactMapper) {
    this.contactMapper = contactMapper;
  }

  public boolean dbEnabled() {
    return contactMapper != null;
  }

  public boolean mailed() {
    return mailSender != null && !to.isBlank();
  }

  public Long handle(ContactRequest req) {
    Long id = null;
    if (dbEnabled()) {
      ContactMessage msg = ContactMessage.of(req.name(), req.email(), req.message());
      contactMapper.insert(msg);
      id = msg.getId();
      log.info("[contact] saved id={}", id);
    } else {
      log.info(
          "[contact] name={} email={} len={} (no DB — logged only)",
          req.name(), req.email(), req.message().length());
    }
    if (mailed()) {
      SimpleMailMessage mail = new SimpleMailMessage();
      mail.setTo(to);
      mail.setSubject("[Portfolio] " + req.name() + " <" + req.email() + ">");
      mail.setText(req.message() + "\n\n— from " + req.name() + " <" + req.email() + ">");
      mailSender.send(mail);
    }
    return id;
  }
}
