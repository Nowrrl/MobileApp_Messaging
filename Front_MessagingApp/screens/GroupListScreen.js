import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const GroupListScreen = ({ route, navigation }) => {
  const { loggedInUser } = route.params || {};
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/groups/user-groups?userId=${loggedInUser.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const groups = await response.json();
        setGroups(groups);
      } else {
        const errorText = await response.text();
        console.error("Error fetching groups:", errorText);
        Alert.alert("Error", "Failed to fetch groups.");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Something went wrong while fetching groups.");
    }
  };

  const handleGroupPress = (group) => {
    navigation.navigate("Group Details", {
      groupId: group.id,
      groupName: group.name,
      creationTime: group.creationTime,
      loggedInUser,
    });
  };

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupContainer}
      onPress={() => handleGroupPress(item)}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupMembers}>Members: {item.members.length}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No groups found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  groupContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupMembers: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default GroupListScreen;
