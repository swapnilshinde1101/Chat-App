package com.chat.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConversationSummaryDTO {
    private Long userId;
    private String username;
    private String lastMessage;
    private int unreadCount;
    private String timestamp;
}
