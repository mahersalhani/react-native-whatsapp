import { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { useNavigation } from "@react-navigation/native";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

const NewGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [name, setName] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then(async (result) => {
      const authUser = await Auth.currentAuthenticatedUser();

      const usersDataFiltered = result.data?.listUsers?.items.filter(
        (user) => user._deleted !== true
      );

      const usersDataFilteredWithoutAuthUser = usersDataFiltered.filter(
        (user) => user.id !== authUser.attributes.sub
      );

      setUsers(usersDataFilteredWithoutAuthUser);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create"
          disabled={!name || selectedUserIds.length < 1}
          onPress={onCreateGroupPress}
        />
      ),
    });
  }, [name, selectedUserIds]);

  const onCreateGroupPress = async () => {
    // Create a new Chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: { name } })
    );

    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
    }

    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // Add the clicked users to the ChatRoom
    await Promise.all(
      selectedUserIds.map((userID) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: newChatRoom.id, userId: userID },
          })
        )
      )
    );

    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    setSelectedUserIds([]);
    // navigate to the newly created ChatRoom
    navigation.navigate("Chat", { id: newChatRoom.id });
  };

  const onContactPress = (id) => {
    setSelectedUserIds((userIds) =>
      userIds.includes(id)
        ? selectedUserIds.filter((uid) => uid !== id)
        : [...userIds, id]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            selectable
            isSelected={selectedUserIds.includes(item.id)}
            onPress={() => onContactPress(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
});

export default NewGroupScreen;
