import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const GroupScreen = ({ route, navigation }) => {
  const { loggedInUser } = route.params || {};
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    fetchFriends();
  }, []);

  // Fetch friends of the logged-in user
  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/friends?userId=${loggedInUser.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const friendsList = await response.json();
        setFriends(friendsList);
      } else {
        Alert.alert("Error", "Failed to fetch friends.");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      Alert.alert("Error", "Something went wrong while fetching friends.");
    }
  };

  // Toggle selection of a friend
  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  // Create a group
  const createGroup = async () => {
    if (selectedFriends.length === 0) {
      Alert.alert(
        "Error",
        "Please select at least one friend to create a group."
      );
      return;
    }

    console.log(
      "Selected Friends (Before Adding LoggedInUser):",
      selectedFriends
    );

    // Add the logged-in user's ID to the selected friends
    const finalGroupMembers = [
      ...new Set([...selectedFriends, loggedInUser.id]),
    ];

    console.log(
      "Final Group Members (Including LoggedInUser):",
      finalGroupMembers
    );

    try {
      const cleanedGroupName = groupName.replace(/"/g, "").trim();

      const baseUrl = "http://10.0.2.2:8080/api/groups/create";
      const url = cleanedGroupName
        ? `${baseUrl}?name=${encodeURIComponent(cleanedGroupName)}`
        : baseUrl;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalGroupMembers), // Include logged-in user's ID
      });

      if (response.ok) {
        Alert.alert("Success", "Group created successfully.");
        setGroupName("");
        setSelectedFriends([]);
      } else {
        const errorText = await response.text();
        console.error("Error creating group:", errorText);
        Alert.alert("Error", "Failed to create group.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Something went wrong while creating group.");
    }
  };

  const renderFriend = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.friendContainer,
        selectedFriends.includes(item.id) && styles.selectedFriend, // Highlight selected friends
      ]}
      onPress={() => toggleFriendSelection(item.id)} // Use friend's ID
    >
      <Text style={styles.friendName}>{item.email}</Text>
    </TouchableOpacity>
  );

  const handleNavigateToGroupList = () => {
    navigation.navigate("Group List", { loggedInUser });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Name (optional)"
        value={groupName}
        onChangeText={setGroupName}
      />
      <Text style={styles.subTitle}>Select Friends:</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFriend}
        ListEmptyComponent={<Text>No friends found.</Text>}
      />
      <TouchableOpacity style={styles.createButton} onPress={createGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={handleNavigateToGroupList}
      >
        <Text style={styles.buttonText}>View Group List</Text>
      </TouchableOpacity>
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
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  friendContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedFriend: {
    backgroundColor: "#007bff", // Highlight selected friends
    borderColor: "#0056b3",
  },
  friendName: {
    fontSize: 16,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  navigateButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GroupScreen;
