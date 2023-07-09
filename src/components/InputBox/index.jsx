import { useState } from "react";

import uuid from "react-native-uuid";

import { TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { API, graphqlOperation, Auth, Storage } from "aws-amplify";

import { View, Image, FlatList } from "react-native";

import {
  createAttachment,
  createMessage,
  updateChatRoom,
} from "../../graphql/mutations";

const InputBox = ({ chatRoom }) => {
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState([]);

  const onSend = async () => {
    if (!newMessage.trim()) return;

    const authUser = await Auth.currentAuthenticatedUser();

    const message = {
      text: newMessage.trim(),
      chatroomID: chatRoom.id,
      userID: authUser.attributes.sub,
    };

    const newMessageData = await API.graphql(
      graphqlOperation(createMessage, {
        input: message,
      })
    );

    setNewMessage("");

    // add attachments
    await Promise.all(
      files.map((file) =>
        addAttachment(file, newMessageData.data.createMessage.id)
      )
    );

    setFiles([]);

    // set the message to be last message
    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: {
          _version: chatRoom._version,
          id: chatRoom.id,
          chatRoomLastMessageId: newMessageData.data.createMessage.id,
        },
      })
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setFiles(result.assets);
    }
  };

  const uploadFile = async ({ uri, type }) => {
    const exts = {
      image: "png",
      video: "mp4",
    };
    const contentTypes = {
      image: "image/png",
      video: "video/mp4",
    };

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const ud = uuid.v4();

      const key = `${ud}.${exts[type]}`;
      await Storage.put(key, blob, {
        contentType: contentTypes[type], // contentType is optional
      });

      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  const addAttachment = async (file, messageID) => {
    const types = {
      image: "IMAGE",
      video: "VIDEO",
    };

    const newAttachment = {
      storageKey: await uploadFile(file),
      type: types[file.type],
      width: file.width,
      height: file.height,
      duration: file.duration,
      messageID,
      chatroomID: chatRoom.id,
    };
    return API.graphql(
      graphqlOperation(createAttachment, { input: newAttachment })
    );
  };

  return (
    <>
      {files.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <FlatList
            data={files}
            renderItem={({ item }) => (
              <>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.selectedImage}
                  resizeMode="contain"
                />
                <MaterialIcons
                  name="highlight-remove"
                  onPress={() =>
                    setFiles((imgs) => [...imgs].filter((img) => img !== item))
                  }
                  size={20}
                  color="gray"
                  style={styles.removeSelectedImage}
                />
              </>
            )}
            horizontal
          />
        </View>
      )}
      <SafeAreaView edges={["bottom"]} style={styles.container}>
        <AntDesign
          onPress={pickImage}
          name="plus"
          size={24}
          color="royalblue"
        />
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          style={styles.input}
          selectionColor="#ccc"
        />
        <MaterialIcons
          onPress={onSend}
          style={styles.send}
          name="send"
          size={24}
          color="white"
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    alignItems: "center",
  },
  input: {
    fontSize: 18,

    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
  attachmentsContainer: {
    alignItems: "flex-end",
  },
  selectedImage: {
    height: 100,
    width: 200,
    margin: 5,
  },
  removeSelectedImage: {
    position: "absolute",
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default InputBox;
