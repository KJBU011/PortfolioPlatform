package com.portfolio.contact.dto;

/**
 * contact_message 행 DTO (dao ↔ service, XML 매핑용).
 * generated key(id) 반환을 위해 mutable 클래스로 유지.
 */
public class ContactMessage {
  private Long id;
  private String name;
  private String email;
  private String message;

  public ContactMessage() {}

  private ContactMessage(Long id, String name, String email, String message) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.message = message;
  }

  public static ContactMessage of(String name, String email, String message) {
    return new ContactMessage(null, name, email, message);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
