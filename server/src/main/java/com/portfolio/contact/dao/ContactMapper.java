package com.portfolio.contact.dao;

import com.portfolio.contact.dto.ContactMessage;
import org.apache.ibatis.annotations.Mapper;

/** 문의 메시지 DAO — SQL은 resources/mappers/ContactMapper.xml */
@Mapper
public interface ContactMapper {
  int insert(ContactMessage message);

  long count();
}
