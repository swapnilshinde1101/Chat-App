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
}

