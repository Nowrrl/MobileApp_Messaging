package com.teleport.cs310_project.service.friend_service;

import com.teleport.cs310_project.model.FriendRequest;
import com.teleport.cs310_project.model.User;

import java.util.List;
import java.util.Optional;

public interface FriendRequestService {
    FriendRequest sendFriendRequest(FriendRequest request);
    FriendRequest acceptFriendRequest(String requestId);
    Optional<FriendRequest> findById(String requestId);
    List<User> getFriends(String userId);
}