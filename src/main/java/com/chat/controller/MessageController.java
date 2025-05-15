package com.chat.controller;

import com.chat.entity.Message;
import com.chat.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping
    public Message sendMessage(@RequestBody Message message){
        return messageService.saveMessage(message);
    }

    @GetMapping("/between")
    public List<Message> getMessagesBetweenUsers(@RequestParam Long senderId, @RequestParam Long receiverId){
        return messageService.getMessagesBetweenUsers(senderId, receiverId);
    }
    
    @GetMapping("/unread")
    public List<Message> getUnreadForUser(@RequestParam Long userId) {
        return messageService.getUnreadMessagesFor(userId);
    }
    
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) { messageService.markAsRead(id); }

    @GetMapping("/all")
    public List<Message> getAllForUser(@RequestParam Long userId) {
        return messageService.getAllMessagesFor(userId);
    }


}


