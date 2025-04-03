package com.teleport.cs310_project.service.message_service;

import com.teleport.cs310_project.model.Message;
import com.teleport.cs310_project.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public Message sendMessage(Message message) {
        message.setTimestamp(new Date());
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessagesBetweenUsers(String senderId, String receiverId) {
        return messageRepository.findBySenderIdAndReceiverId(senderId, receiverId);
    }

    public List<Message> getMessagesByGroupId(String groupId) {
        return messageRepository.findByGroupId(groupId);
    }

}
