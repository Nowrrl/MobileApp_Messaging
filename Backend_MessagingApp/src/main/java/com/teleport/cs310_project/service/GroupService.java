package com.teleport.cs310_project.service;

import com.teleport.cs310_project.model.Group;
import com.teleport.cs310_project.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    public Group createGroup(String name, List<String> members) {
        Group group = new Group(name, members);
        return groupRepository.save(group);
    }

    public Group addMemberToGroup(String groupId, String memberId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.getMembers().add(memberId);
        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(String groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    public Group updateGroup(String groupId, String name, List<String> members) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setName(name);
        group.setMembers(members);
        return groupRepository.save(group);
    }

    public void deleteGroup(String groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        groupRepository.delete(group);
    }

    public List<Group> getGroupsForUser(String userId) {
        return groupRepository.findByMembersContaining(userId);
    }
}
