package com.chat.controller;

import com.chat.dto.MessageDTO;
import com.chat.entity.Message;
import com.chat.entity.User;
import com.chat.service.MessageService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    public static class SendMessageRequest {
        @NotBlank(message = "Content must not be blank")
        public String content;

        @NotNull(message = "Receiver ID is required")
        public Long receiverId;
    }

    // Send message, senderId taken from token
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long senderId = Long.parseLong(userDetails.getUsername());  // Extract sender ID from token

        Message message = Message.builder()
                .content(request.content)
                .sender(User.builder().id(senderId).build())
                .receiver(User.builder().id(request.receiverId).build())
                .build();

        Message saved = messageService.saveMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    // Get messages between authenticated user and another user
    @GetMapping("/between")
    public ResponseEntity<List<MessageDTO>> getMessagesBetweenUsers(
            @RequestParam Long otherUserId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = Long.parseLong(userDetails.getUsername());

        List<Message> messages = messageService.getMessagesBetweenUsers(currentUserId, otherUserId);
        List<MessageDTO> dtos = messages.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get unread messages for authenticated user only
    @GetMapping("/unread")
    public ResponseEntity<List<MessageDTO>> getUnreadForUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = Long.parseLong(userDetails.getUsername());

        List<Message> unread = messageService.getUnreadMessagesFor(currentUserId);
        List<MessageDTO> dtos = unread.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Mark a message as read (any authenticated user can mark messages, you can add more validation if needed)
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            messageService.markAsRead(id);
            return ResponseEntity.ok().body(new ApiResponse(true, "Message marked as read"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Message not found"));
        }
    }

    // Get all messages received by authenticated user
    @GetMapping("/all")
    public ResponseEntity<List<MessageDTO>> getAllForUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = Long.parseLong(userDetails.getUsername());

        List<Message> all = messageService.getAllMessagesFor(currentUserId);
        List<MessageDTO> dtos = all.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private MessageDTO toDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .isRead(message.isRead())
                .timestamp(message.getTimestamp())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getName())
                .build();
    }

    static class ApiResponse {
        private boolean success;
        private String message;

        public ApiResponse(boolean success, String message){
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }
}
