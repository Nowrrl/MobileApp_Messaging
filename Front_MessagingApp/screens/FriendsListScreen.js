import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const FriendsListScreen = ({ route, navigation }) => {
  const { loggedInUser } = route.params || {};
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!loggedInUser || !loggedInUser.id) {
      Alert.alert("Error", "User details are missing. Please log in again.");
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
      return;
    }

    fetchFriends(); // Fetch the friends list on mount
  }, [loggedInUser]);

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

        // Remove duplicates based on email
        const uniqueFriends = friendsList.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f.email === friend.email)
        );

        setFriends(uniqueFriends);
      } else {
        const errorText = await response.text();
        console.error("Error fetching friends list:", errorText);
        Alert.alert("Error", "Failed to fetch friends list.");
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
      Alert.alert("Error", "Something went wrong while fetching friends list.");
    }
  };

  const handleMessage = (receiverId, receiverEmail) => {
    navigation.navigate("Message", {
      loggedInUser,
      receiverId,
      receiverEmail,
    });
  };

  const handleNavigateToGroups = () => {
    navigation.navigate("Groups", { loggedInUser });
  };
  const handleFollowBack = async (receiverId, index) => {
    try {
      const response = await fetch("http://10.0.2.2:8080/api/friends/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: loggedInUser.id,
          receiverId,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Followed back successfully.");

        // Update the specific item's action to "REQUESTED"
        const updatedFriends = [...friends];
        updatedFriends[index].action = "REQUESTED";
        setFriends(updatedFriends);
      } else {
        const errorText = await response.text();
        console.error("Error following back:", errorText);
        Alert.alert("Error", "Failed to follow back.");
      }
    } catch (error) {
      console.error("Error following back:", error);
      Alert.alert("Error", "Unable to follow back.");
    }
  };

  const renderFriend = ({ item, index }) => (
    <View style={styles.friendContainer}>
      <Text style={styles.friendName}>Friend Email: {item.email}</Text>
      <TouchableOpacity
        style={
          item.action === "MESSAGE"
            ? styles.messageButton
            : item.action === "REQUESTED"
            ? styles.requestedButton
            : styles.followBackButton
        }
        onPress={() => {
          if (item.action === "MESSAGE") {
            handleMessage(item.receiverId);
          } else if (item.action === "FOLLOW_BACK") {
            handleFollowBack(item.receiverId, index);
          }
        }}
        disabled={item.action === "REQUESTED"}
      >
        <Text
          style={
            item.action === "REQUESTED"
              ? styles.requestedButtonText
              : styles.buttonText
          }
        >
          {item.action === "MESSAGE"
            ? "Message"
            : item.action === "REQUESTED"
            ? "Requested"
            : "Follow Back"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFriend}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No friends found.</Text>
        )}
      />
      <TouchableOpacity
        style={styles.groupButton}
        onPress={handleNavigateToGroups}
      >
        <Text style={styles.buttonText}>Create Group</Text>
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
  friendContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  friendName: {
    fontSize: 16,
    color: "#333",
  },
  groupButton: {
    backgroundColor: "#f0ad4e",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  messageButton: {
    backgroundColor: "#28a745", // Green for message button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  followBackButton: {
    backgroundColor: "#ffcc00", // Yellow for follow back button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  requestedButton: {
    backgroundColor: "#ffffff", // White background for requested button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ffcc00", // Yellow border
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  requestedButtonText: {
    color: "#ffcc00", // Yellow text
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default FriendsListScreen;
