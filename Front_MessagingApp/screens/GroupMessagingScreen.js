import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const GroupMessagingScreen = ({ route }) => {
  const { loggedInUser, groupId, groupName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!groupId || !loggedInUser) {
      Alert.alert("Error", "Group ID or User information is missing.");
      return;
    }

    fetchMessages(); // Fetch messages for the group
  }, [groupId]);

  // Fetch messages for the group
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/groups/${groupId}/messages`
      );

      if (response.ok) {
        const groupMessages = await response.json();
        setMessages(groupMessages); // Update the state with messages
      } else {
        const errorText = await response.text();
        console.error("Error fetching messages:", errorText);
        Alert.alert("Error", "Failed to fetch messages.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      Alert.alert("Error", "Something went wrong while fetching messages.");
    }
  };

  // Send a message to the group
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert("Error", "Message content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/groups/${groupId}/send?senderId=${loggedInUser.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        }
      );

      if (response.ok) {
        setNewMessage(""); // Clear the input field
        fetchMessages(); // Refresh the message list
      } else {
        const errorText = await response.text();
        console.error("Error sending message:", errorText);
        Alert.alert("Error", "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Something went wrong while sending message.");
    }
  };

  // Render each message
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === loggedInUser.id
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageSender}>
        {item.senderId === loggedInUser.id ? "You" : `User: ${item.senderId}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName || "Group Messages"}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  messageList: {
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  sentMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#28a745",
    alignSelf: "flex-start",
  },
  messageContent: {
    color: "#fff",
    fontSize: 16,
  },
  messageSender: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GroupMessagingScreen;
