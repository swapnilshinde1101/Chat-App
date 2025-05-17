package com.chat.controller;

import com.chat.dto.ConversationSummaryDTO;
import com.chat.dto.MessageDTO;
import com.chat.entity.User;

import com.chat.entity.Message;
import com.chat.entity.User;
import com.chat.service.MessageService;
import com.chat.service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserService    userService;

    public MessageController(MessageService messageService,
                             UserService userService) {
        this.messageService = messageService;
        this.userService    = userService;
    }

    public static class SendMessageRequest {
        @NotBlank(message = "Content must not be blank")
        public String content;

        @NotNull(message = "Receiver ID is required")
        public Long receiverId;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Look up full User entities
        User sender   = userService.findByEmail(userDetails.getUsername());
        User receiver = userService.getUserById(request.receiverId);
        if (receiver == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Message message = Message.builder()
                .content(request.content)
                .sender(sender)
                .receiver(receiver)
                .build();

        Message saved = messageService.saveMessage(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/between")
    public ResponseEntity<List<MessageDTO>> getMessagesBetweenUsers(
            @RequestParam Long otherUserId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = userService.findByEmail(userDetails.getUsername()).getId();
        List<MessageDTO> dtos = messageService
            .getMessagesBetweenUsers(currentUserId, otherUserId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/unread")
    public ResponseEntity<List<MessageDTO>> getUnreadForUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = userService.findByEmail(userDetails.getUsername()).getId();
        List<MessageDTO> dtos = messageService
            .getUnreadMessagesFor(currentUserId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            messageService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse(true, "Message marked as read"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, "Message not found"));
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/all")
    public ResponseEntity<List<MessageDTO>> getAllForUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = userService.findByEmail(userDetails.getUsername()).getId();
        List<MessageDTO> dtos = messageService
            .getAllMessagesFor(currentUserId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private MessageDTO toDTO(Message m) {
        return MessageDTO.builder()
                .id(m.getId())
                .content(m.getContent())
                .isRead(m.isRead())
                .timestamp(m.getTimestamp())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getUsername())
                .receiverId(m.getReceiver().getId())
                .receiverName(m.getReceiver().getUsername())
                .build();
    }

    static class ApiResponse {
        private final boolean success;
        private final String  message;

        public ApiResponse(boolean success, String message){
            this.success = success;
            this.message = message;
        }
        public boolean isSuccess() { return success; }
        public String  getMessage() { return message; }
    }
    
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummaryDTO>> getUserConversations(
        @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(messageService.getUserConversations(user.getId()));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/mark-read")
    public ResponseEntity<Void> markConversationAsRead(
        @RequestParam Long senderId,
        @AuthenticationPrincipal UserDetails userDetails) {
        
        Long receiverId = userService.findByEmail(userDetails.getUsername()).getId();
        messageService.markConversationAsRead(receiverId, senderId);
        return ResponseEntity.ok().build();
    }
}
