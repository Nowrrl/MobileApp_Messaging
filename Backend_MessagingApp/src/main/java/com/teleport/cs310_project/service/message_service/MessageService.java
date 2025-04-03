package com.teleport.cs310_project.service.message_service;

import com.teleport.cs310_project.model.Message;
import java.util.List;

public interface MessageService {
    Message sendMessage(Message message);
    List<Message> getMessagesBetweenUsers(String userId, String friendId);
    List<Message> getMessagesByGroupId(String groupId);
}