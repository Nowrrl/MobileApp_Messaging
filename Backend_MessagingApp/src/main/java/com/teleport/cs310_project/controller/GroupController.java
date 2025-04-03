package com.teleport.cs310_project.controller;

import com.teleport.cs310_project.model.Group;
import com.teleport.cs310_project.model.Message;
import com.teleport.cs310_project.model.User;
import com.teleport.cs310_project.repository.GroupRepository;
import com.teleport.cs310_project.service.GroupService;
import com.teleport.cs310_project.service.message_service.MessageService;
import com.teleport.cs310_project.service.user_service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.time.ZoneId; // If you're working with time zones
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;
    private final GroupRepository groupRepository;

    @Autowired
    private MessageService messageService;

    private final UserService userService; // Inject UserService to fetch user details

    public GroupController(GroupRepository groupRepository, UserService userService, MessageService messageService) {
        this.groupRepository = groupRepository;
        this.userService = userService;
        this.messageService = messageService;
    }

    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestParam(required = false) String name, @RequestBody List<String> members) {
        if (members.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Provide default group name
        String groupName = name != null ? name : "Default Group";

        Group newGroup = new Group();
        newGroup.setName(groupName);
        newGroup.setMembers(members);
        newGroup.setCreationTime(LocalDateTime.now());

        System.out.println("Attempting to save group: " + newGroup);

        Group savedGroup = groupRepository.save(newGroup);

        System.out.println("Saved group: " + savedGroup);

        return ResponseEntity.ok(savedGroup);
    }



    @PostMapping("/{groupId}/add-member")
    public Group addMemberToGroup(@PathVariable String groupId, @RequestParam String memberId) {
        return groupService.addMemberToGroup(groupId, memberId);
    }

    @GetMapping("/user-groups")
    public List<Group> getGroupsForUser(@RequestParam String userId) {
        return groupService.getGroupsForUser(userId);
    }


    @PostMapping("/{groupId}/send")
    public ResponseEntity<String> sendMessageToGroup(
            @PathVariable String groupId,
            @RequestParam String senderId,
            @RequestBody String content) {

        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found");
        }

        // Create a new message object
        Message message = new Message();
        message.setGroupId(groupId);
        message.setSenderId(senderId);
        message.setContent(content);
        message.setTimestamp(new Date()); // Set the current timestamp

        // Save the message
        messageService.sendMessage(message);

        return ResponseEntity.ok("Message sent to the group");
    }



    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable String groupId) {
        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Fetch all messages associated with the group
        List<Message> messages = messageService.getMessagesByGroupId(groupId);

        return ResponseEntity.ok(messages);
    }


    @GetMapping("/{groupId}/members")
    public List<String> getGroupMembers(@PathVariable String groupId) {
        Group group = groupService.getGroupById(groupId);
        if (group == null) {
            throw new RuntimeException("Group not found");
        }
        return group.getMembers();
    }





    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{groupId}")
    public Group getGroupById(@PathVariable String groupId) {
        return groupService.getGroupById(groupId);
    }
}
