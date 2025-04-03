import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

const GroupDetailsScreen = ({ route, navigation }) => {
  const { groupId, groupName, creationTime, loggedInUser } = route.params || {};
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    if (!groupId || !loggedInUser) {
      Alert.alert("Error", "Group ID or logged in user is missing.");
      return;
    }

    fetchGroupMembers(); // Fetch the group members
  }, [groupId, loggedInUser]);

  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/groups/${groupId}/members`
      );

      if (response.ok) {
        const members = await response.json();
        console.log("Group Members:", members); // Debugging
        setGroupMembers(members); // Update state with member IDs
      } else {
        const errorText = await response.text();
        console.error("Error fetching group members:", errorText);
        Alert.alert("Error", "Failed to fetch group members.");
      }
    } catch (error) {
      console.error("Error fetching group members:", error);
      Alert.alert(
        "Error",
        "Something went wrong while fetching group members."
      );
    }
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberContainer}>
      <Text style={styles.memberText}>User ID: {item}</Text>
    </View>
  );

  const navigateToGroupMessaging = () => {
    console.log("Navigating with groupId:", groupId);
    console.log("Navigating with loggedInUser:", loggedInUser);

    if (!groupId || !loggedInUser) {
      Alert.alert("Error", "Group or user information is missing.");
      return;
    }

    navigation.navigate("Group Messaging", {
      groupId: groupId, // Pass the groupId
      loggedInUser: loggedInUser, // Pass the loggedInUser object
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName || "Group Details"}</Text>
      <Text style={styles.infoText}>
        Created At: {creationTime || "Unknown"}
      </Text>
      <Text style={styles.subTitle}>Group Members:</Text>
      <FlatList
        data={groupMembers}
        keyExtractor={(item, index) => index.toString()} // Use index as key since item is an ID
        renderItem={renderMember}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No members found for this group.</Text>
        }
      />
      {/* Button to navigate to Group Messaging */}
      <TouchableOpacity
        style={styles.messagingButton}
        onPress={navigateToGroupMessaging}
      >
        <Text style={styles.buttonText}>Go to Group Messaging</Text>
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
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  memberContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  memberText: {
    fontSize: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  messagingButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GroupDetailsScreen;
