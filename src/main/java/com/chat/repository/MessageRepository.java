package com.chat.repository;

import com.chat.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Only fetch messages exchanged between users that are not soft-deleted
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender.id = :senderId AND m.receiver.id = :receiverId) OR " +
           "(m.sender.id = :receiverId AND m.receiver.id = :senderId)) " +
           "AND m.isDeleted = false " +
           "ORDER BY m.timestamp ASC")
    List<Message> findMessagesBetweenUsers(@Param("senderId") Long senderId, 
                                           @Param("receiverId") Long receiverId);

    // Unread + not deleted
    List<Message> findByReceiverIdAndIsReadFalseAndIsDeletedFalseOrderByTimestampDesc(Long receiverId);

    // All messages received (not deleted)
    List<Message> findByReceiverIdAndIsDeletedFalseOrderByTimestampDesc(Long receiverId);
}
