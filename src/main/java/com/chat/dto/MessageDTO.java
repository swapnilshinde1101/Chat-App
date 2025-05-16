package com.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageDTO {
    private Long id;
    private String content;
    private boolean isRead;
    private LocalDateTime timestamp;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
	
    
    
    
}
