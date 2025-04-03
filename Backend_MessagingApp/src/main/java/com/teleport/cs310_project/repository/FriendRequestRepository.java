package com.teleport.cs310_project.repository;

import com.teleport.cs310_project.model.FriendRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {

    List<FriendRequest> findByStatusAndSenderId(String status, String senderId);
    List<FriendRequest> findByStatusAndReceiverId(String status, String receiverId);
    List<FriendRequest> findBySenderIdAndStatus(String senderId, String status);
    boolean existsBySenderIdAndReceiverIdAndStatus(String senderId, String receiverId, String status);
    // Additional query methods if needed
}