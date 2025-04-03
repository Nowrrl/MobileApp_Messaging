package com.teleport.cs310_project.controller;

import com.teleport.cs310_project.model.Message;
import com.teleport.cs310_project.repository.MessageRepository;
import com.teleport.cs310_project.service.message_service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;
    private MessageRepository messageRepository;

    @Autowired
    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    @PostMapping("/send")
    public String sendMessage(@RequestBody Message message) {
        messageService.sendMessage(message);
        return "Message sent";
    }

    @GetMapping
    public List<Message> getMessages(
            @RequestParam String userId,
            @RequestParam String friendId
    ) {
        return messageRepository.findAllByParticipants(userId, friendId);
    }


}
