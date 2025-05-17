package com.chat.repository;

import com.chat.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {



    List<Message> findByReceiverIdAndIsReadFalseOrderByTimestampDesc(Long receiverId);

    List<Message> findByReceiverIdOrderByTimestampDesc(Long receiverId);
    
    
    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender.id = :senderId AND m.receiver.id = :receiverId) OR " +
            "(m.sender.id = :receiverId AND m.receiver.id = :senderId) " +
            "ORDER BY m.timestamp DESC")
     List<Message> findMessagesBetweenUsers(@Param("senderId") Long senderId, 
                                          @Param("receiverId") Long receiverId);

     @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.receiver.id ELSE m.sender.id END " +
            "FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
     List<Long> findDistinctPartners(@Param("userId") Long userId);

     @Query("SELECT m FROM Message m WHERE " +
            "((m.sender.id = :user1 AND m.receiver.id = :user2) OR " +
            "(m.sender.id = :user2 AND m.receiver.id = :user1)) " +
            "ORDER BY m.timestamp DESC LIMIT 1")
     Message findLastMessageBetweenUsers(@Param("user1") Long user1, 
                                       @Param("user2") Long user2);

     @Query("SELECT COUNT(m) FROM Message m WHERE " +
            "m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.isRead = false")
     int countUnreadMessages(@Param("receiverId") Long receiverId, 
                           @Param("senderId") Long senderId);
     
     @Query("SELECT m FROM Message m WHERE " +
             "m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.isRead = false")
      List<Message> findUnreadMessages(@Param("receiverId") Long receiverId,
                                     @Param("senderId") Long senderId);
     
}
