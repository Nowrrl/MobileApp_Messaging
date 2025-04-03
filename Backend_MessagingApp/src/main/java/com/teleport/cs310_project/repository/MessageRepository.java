package com.teleport.cs310_project.repository;

import com.teleport.cs310_project.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    @Query("{ 'senderId': ?0, 'receiverId': ?1 }")
    List<Message> findBySenderIdAndReceiverId(String senderId, String receiverId);
    @Query("{ $or: [ { $and: [ { 'senderId': ?0 }, { 'receiverId': ?1 } ] }, { $and: [ { 'senderId': ?1 }, { 'receiverId': ?0 } ] } ] }")
    List<Message> findAllByParticipants(String userId, String friendId);
    List<Message> findByGroupId(String groupId);

}
