package com.teleport.cs310_project.service.friend_service;

import com.teleport.cs310_project.model.FriendRequest;
import com.teleport.cs310_project.model.User;
import com.teleport.cs310_project.repository.FriendRequestRepository;
import com.teleport.cs310_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class FriendRequestServiceImpl implements FriendRequestService {

    private final FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public FriendRequestServiceImpl(FriendRequestRepository friendRequestRepository) {
        this.friendRequestRepository = friendRequestRepository;
    }

    @Override
    public List<User> getFriends(String userId) {
        // Fetch all accepted friend requests for the user
        List<FriendRequest> sentRequests = friendRequestRepository.findByStatusAndSenderId("ACCEPTED", userId);
        List<FriendRequest> receivedRequests = friendRequestRepository.findByStatusAndReceiverId("ACCEPTED", userId);

        // Collect friend IDs
        Set<String> friendIds = new HashSet<>();
        sentRequests.forEach(request -> friendIds.add(request.getReceiverId()));
        receivedRequests.forEach(request -> friendIds.add(request.getSenderId()));

        // Fetch and return User details for these IDs
        return userRepository.findAllById(friendIds);
    }

    @Override
    public FriendRequest sendFriendRequest(FriendRequest request) {
        request.setStatus("PENDING");
        return friendRequestRepository.save(request);
    }

    @Override
    public FriendRequest acceptFriendRequest(String id) {
        // Ensure the senderId matches a valid friend request
        return friendRequestRepository.findById(id)
                .map(request -> {
                    if (!request.getId().equals(id)) {
                        throw new RuntimeException("Sender ID " + id + " does not match the request sender ID");
                    }
                    request.setStatus("ACCEPTED");
                    return friendRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Friend request with sender ID " + id + " not found"));
    }

    @Override
    public Optional<FriendRequest> findById(String requestId) {
        return friendRequestRepository.findById(requestId);
    }
}
