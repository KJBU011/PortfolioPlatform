package com.portfolio.contact.controller;

import com.portfolio.common.ApiResponse;
import com.portfolio.contact.dto.ContactRequest;
import com.portfolio.contact.service.ContactService;
import jakarta.validation.Valid;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

  private final ContactService contactService;

  public ContactController(ContactService contactService) {
    this.contactService = contactService;
  }

  @PostMapping
  public ResponseEntity<ApiResponse<?>> submit(@Valid @RequestBody ContactRequest req) {
    Long id = contactService.handle(req);
    Map<String, Object> data = new LinkedHashMap<>();
    if (id != null) {
      data.put("id", id);
    }
    data.put("mailed", contactService.mailed());
    data.put("saved", contactService.dbEnabled());
    return ResponseEntity.ok(ApiResponse.ok(data, "메시지를 접수했습니다."));
  }
}
