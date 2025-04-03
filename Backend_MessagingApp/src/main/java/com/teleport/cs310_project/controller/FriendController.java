package com.teleport.cs310_project.controller;

import com.teleport.cs310_project.model.FriendRequest;
import com.teleport.cs310_project.model.User;
import com.teleport.cs310_project.repository.FriendRequestRepository;
import com.teleport.cs310_project.repository.UserRepository;
import com.teleport.cs310_project.service.friend_service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    @Autowired
    private FriendRequestService friendRequestService;
    private FriendRequestRepository friendRequestRepository;
    private UserRepository userRepository;

    @Autowired
    public FriendController(FriendRequestRepository friendRequestRepository, UserRepository userRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
    }

    @GetMapping(params = "userId")
    public List<Map<String, Object>> getFollowStatus(@RequestParam String userId) {
        List<FriendRequest> acceptedRequests =
                friendRequestRepository.findBySenderIdAndStatus(userId, "ACCEPTED");

        List<Map<String, Object>> result = new ArrayList<>();
        for (FriendRequest request : acceptedRequests) {
            Optional<User> receiver = userRepository.findById(request.getReceiverId());
            if (receiver.isPresent()) {
                // Check if the receiver has sent a request back to the sender
                boolean followsBack = friendRequestRepository.existsBySenderIdAndReceiverIdAndStatus(
                        request.getReceiverId(), userId, "ACCEPTED");

                Map<String, Object> friendDetails = new HashMap<>();
                friendDetails.put("id", request.getId());
                friendDetails.put("email", receiver.get().getEmail());
                friendDetails.put("receiverId", request.getReceiverId());
                friendDetails.put("action", followsBack ? "MESSAGE" : "FOLLOW_BACK");
                result.add(friendDetails);
            }
        }
        return result;
    }



    @GetMapping
    public List<FriendRequest> getAllFriends() {
        // Fetch and return all rows from the friends database
        return friendRequestRepository.findAll();
    }


    @PostMapping("/add")
    public FriendRequest sendFriendRequest(@RequestBody FriendRequest request) {
        // Save the friend request
        FriendRequest savedRequest = friendRequestService.sendFriendRequest(request);

        // Log the requestI1111235813d to the console
        System.out.println("Friend request created with requestId: " + savedRequest.getId());

        // Return the saved friend request, which includes the requestId
        return savedRequest;
    }


    @PostMapping("/accept")
    public String acceptFriendRequest(@RequestParam String requestId) {
        try {
            friendRequestService.acceptFriendRequest(requestId);
            return "Friend request accepted";
        } catch (RuntimeException ex) {
            return "Error: " + ex.getMessage(); // Return a user-friendly error message
        }
    }
}