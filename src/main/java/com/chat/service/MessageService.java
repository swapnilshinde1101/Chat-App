package com.chat.service;

import com.chat.entity.Message;

import java.util.List;

public interface MessageService {

    Message saveMessage(Message message);

    List<Message> getMessagesBetweenUsers(Long senderId, Long receiverId);

    List<Message> getUnreadMessagesFor(Long userId);

    void markAsRead(Long messageId);

    List<Message> getAllMessagesFor(Long userId);
}
