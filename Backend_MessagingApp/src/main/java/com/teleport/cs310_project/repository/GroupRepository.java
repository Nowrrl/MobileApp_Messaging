package com.teleport.cs310_project.repository;

import com.teleport.cs310_project.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
    @Query("{ 'members': { $in: [?0]}}")
    List<Group> findByMembersContaining(String userId);
}
