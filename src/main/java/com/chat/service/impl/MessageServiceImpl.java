package com.chat.service.impl;

import com.chat.dto.ConversationSummaryDTO;
import com.chat.entity.Message;
import com.chat.entity.User;
import com.chat.repository.MessageRepository;
import com.chat.repository.UserRepository;
import com.chat.service.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageServiceImpl(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Message saveMessage(Message message) {
        if (!userRepository.existsById(message.getSender().getId()) ||
            !userRepository.existsById(message.getReceiver().getId())) {
            throw new IllegalArgumentException("Sender or receiver does not exist");
        }
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
    @Transactional
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

    @Override
    public List<ConversationSummaryDTO> getUserConversations(Long currentUserId) {
        if (!userRepository.existsById(currentUserId)) {
            throw new IllegalArgumentException("User not found");
        }

        List<Long> partnerIds = messageRepository.findDistinctPartners(currentUserId);

        return partnerIds.stream().map(partnerId -> {
            User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

            List<Message> lastMessages = messageRepository.findLastMessageBetweenUsers(currentUserId, partnerId, PageRequest.of(0,1));
            Message lastMessage = lastMessages.isEmpty() ? null : lastMessages.get(0);
            int unreadCount = messageRepository.countUnreadMessages(currentUserId, partnerId);

            return ConversationSummaryDTO.builder()
                .userId(partner.getId())
                .username(partner.getUsername())
                .lastMessage(lastMessage != null ? lastMessage.getContent() : "No messages")
                .unreadCount(unreadCount)
                .timestamp(lastMessage != null ? lastMessage.getTimestamp().toString() : "")
                .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markConversationAsRead(Long currentUserId, Long senderId) {
        if (!userRepository.existsById(currentUserId) || !userRepository.existsById(senderId)) {
            throw new IllegalArgumentException("User not found");
        }

        List<Message> unreadMessages = messageRepository.findUnreadMessages(currentUserId, senderId);
        unreadMessages.forEach(message -> {
            message.setRead(true);
            messageRepository.save(message);
        });
    }
}
