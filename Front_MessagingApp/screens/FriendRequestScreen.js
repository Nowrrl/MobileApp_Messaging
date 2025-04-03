import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

const FriendRequestScreen = ({ route, navigation }) => {
  const { loggedInUser } = route.params || {};
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!loggedInUser || !loggedInUser.id) {
      Alert.alert("Error", "User details are missing. Please log in again.");
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
      return;
    }

    fetchUsers(); // Fetch all users
    fetchIncomingRequests(); // Fetch incoming friend requests
  }, [loggedInUser]);

  useEffect(() => {
    filterUsers();
  }, [users, searchText]);

  // Fetch all users excluding the logged-in user
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8080/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const usersList = await response.json();
        const nonSelfUsers = usersList.filter(
          (user) => user.id !== loggedInUser.id
        );
        setUsers(nonSelfUsers);
        setFilteredUsers(nonSelfUsers);
      } else {
        Alert.alert("Error", "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Something went wrong while fetching users.");
    }
  };

  // Fetch incoming friend requests
  const fetchIncomingRequests = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/friends?userId=${loggedInUser.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const requests = await response.json();
        const filteredRequests = requests.filter(
          (request) =>
            request.receiverId === loggedInUser.id &&
            request.status === "PENDING"
        );
        setIncomingRequests(filteredRequests);
      } else {
        const errorText = await response.text();
        console.error("Error fetching incoming requests:", errorText);
        Alert.alert("Error", "Failed to fetch incoming requests.");
      }
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
      Alert.alert(
        "Error",
        "Something went wrong while fetching incoming requests."
      );
    }
  };

  // Filter users based on search text
  const filterUsers = () => {
    if (searchText === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Send a friend request
  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/friends/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: loggedInUser.id, // Logged-in user's ID
          receiverId, // ID of the selected user
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Friend request sent.");
        fetchUsers(); // Refresh the users list to exclude the new friend
      } else {
        const errorText = await response.text();
        console.error("Error sending friend request:", errorText);
        Alert.alert("Error", errorText || "Failed to send the friend request.");
      }
    } catch (error) {
      console.error("Error in sendFriendRequest:", error);
      Alert.alert(
        "Error",
        "Something went wrong while sending the friend request."
      );
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/friends/accept?requestId=${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Friend request accepted.");
        fetchIncomingRequests(); // Refresh incoming requests after acceptance
      } else {
        const errorText = await response.text();
        console.error("Error accepting friend request:", errorText);
        Alert.alert("Error", "Failed to accept friend request.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", "Unable to accept friend request.");
    }
  };

  const goToFriendsList = () => {
    navigation.navigate("Friends List", { loggedInUser });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Users</Text>
      <TextInput
        style={styles.input}
        placeholder="Search users"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.email}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => sendFriendRequest(item.id)}
            >
              <Text style={styles.buttonText}>Send Request</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text style={styles.title}>Incoming Requests</Text>
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestContainer}>
            <Text style={styles.requestText}>
              Friend request from: {item.senderId}
            </Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptFriendRequest(item.id)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Yellow Button to Navigate to Friends List */}
      <TouchableOpacity style={styles.yellowButton} onPress={goToFriendsList}>
        <Text style={styles.yellowButtonText}>View Friends List</Text>
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
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  userName: {
    fontSize: 18,
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  requestContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  requestText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
  },
  yellowButton: {
    backgroundColor: "#ffd700", // Yellow background
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  yellowButtonText: {
    color: "#000", // Black text
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FriendRequestScreen;
