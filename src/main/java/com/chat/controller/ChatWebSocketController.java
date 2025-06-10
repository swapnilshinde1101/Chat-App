package com.chat.controller;


import com.chat.dto.MessageDTO;
import com.chat.entity.Message;
import com.chat.entity.User;
import com.chat.service.MessageService;
import com.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @MessageMapping("/send")
    public void sendMessage(SendMessagePayload payload) {
        User sender = userService.getUserById(payload.getSenderId());
        User receiver = userService.getUserById(payload.getReceiverId());

        Message message = Message.builder()
                .content(payload.getContent())
                .sender(sender)
                .receiver(receiver)
                .build();

        Message saved = messageService.saveMessage(message);

        MessageDTO dto = MessageDTO.builder()
                .id(saved.getId())
                .content(saved.getContent())
                .isRead(saved.isRead())
                .timestamp(saved.getTimestamp())
                .senderId(sender.getId())
                .senderName(sender.getUsername())
                .receiverId(receiver.getId())
                .receiverName(receiver.getUsername())
                .build();

        messagingTemplate.convertAndSend("/topic/messages/" + receiver.getId(), dto);
    }

    public static class SendMessagePayload {
        private Long senderId;
        private Long receiverId;
        private String content;
		public Long getSenderId() {
			return senderId;
		}
		public void setSenderId(Long senderId) {
			this.senderId = senderId;
		}
		public Long getReceiverId() {
			return receiverId;
		}
		public void setReceiverId(Long receiverId) {
			this.receiverId = receiverId;
		}
		public String getContent() {
			return content;
		}
		public void setContent(String content) {
			this.content = content;
		}

       
    }
}
