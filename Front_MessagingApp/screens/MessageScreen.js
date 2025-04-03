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

const MessageScreen = ({ route }) => {
  const { loggedInUser, receiverId, receiverEmail } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (!loggedInUser || !receiverId) {
      Alert.alert("Error", "Messaging details are missing.");
      return;
    }
    fetchMessages(); // Fetch the conversation history on mount
  }, [loggedInUser, receiverId]);

  // Fetch conversation history between the logged-in user and the selected friend
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/messages?userId=${loggedInUser.id}&friendId=${receiverId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const messagesList = await response.json();
        console.log("Fetched Messages:", messagesList);
        setMessages(messagesList);
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

  // Send a new message
  const sendMessage = async () => {
    if (!messageContent.trim()) {
      Alert.alert("Error", "Message cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:8080/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: loggedInUser.id,
          receiverId,
          content: messageContent.trim(),
        }),
      });

      if (response.ok) {
        setMessageContent(""); // Clear input
        fetchMessages(); // Refresh the conversation
      } else {
        const errorText = await response.text();
        console.error("Error sending message:", errorText);
        Alert.alert("Error", "Failed to send the message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Something went wrong while sending the message.");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === loggedInUser.id
          ? styles.sentMessage
          : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {receiverEmail}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageContent}
          onChangeText={setMessageContent}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff", // Blue for sent messages
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    maxWidth: "75%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#d1e7dd", // Light green for received messages
    borderRadius: 10,
    padding: 10,
    maxWidth: "75%",
  },
  messageText: {
    color: "#000", // Black text for readability
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MessageScreen;
