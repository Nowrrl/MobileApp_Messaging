import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import FriendRequestScreen from "./screens/FriendRequestScreen";
import FriendsListScreen from "./screens/FriendsListScreen";
import GroupsScreen from "./screens/GroupsScreen";
import GroupListScreen from "./screens/GroupListScreen";
import GroupDetailsScreen from "./screens/GroupDetailsScreen";
import MessageScreen from "./screens/MessageScreen";
import GroupMessagingScreen from "./screens/GroupMessagingScreen"; // Import the screen

const Stack = createNativeStackNavigator();

export default function App() {
  const [registeredUsers, setRegisteredUsers] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register">
          {(props) => (
            <RegisterScreen
              {...props}
              setRegisteredUsers={setRegisteredUsers}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen {...props} setRegisteredUsers={setRegisteredUsers} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Friend Requests">
          {(props) => (
            <FriendRequestScreen {...props} registeredUsers={registeredUsers} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Friends List">
          {(props) => <FriendsListScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Groups">
          {(props) => <GroupsScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Group List">
          {(props) => <GroupListScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Group Details">
          {(props) => <GroupDetailsScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Message">
          {(props) => <MessageScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Group Messaging">
          {(props) => <GroupMessagingScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
