package com.chat.service.impl;


import com.chat.entity.Message;
import com.chat.repository.MessageRepository;
import com.chat.service.MessageService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessagesBetweenUsers(Long senderId, Long receiverId) {
        return messageRepository.findMessagesBetweenUsers(senderId, receiverId);
    }

    @Override
    public List<Message> getUnreadMessagesFor(Long userId) {
        return messageRepository.findByReceiverIdAndIsReadFalseOrderByTimestampDesc(userId);
    }

    @Override
    public void markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        message.setRead(true);
        messageRepository.save(message);
    }

    @Override
    public List<Message> getAllMessagesFor(Long userId) {
        return messageRepository.findByReceiverIdOrderByTimestampDesc(userId);
    }



}
