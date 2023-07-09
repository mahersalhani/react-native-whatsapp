import { Button, View } from "react-native";

import { Auth } from "aws-amplify";

const SettingsScreen = () => {
  async function signOutHandler() {
    await Auth.signOut();
  }

  return (
    <View>
      <Button title="Click me" onPress={signOutHandler} />
    </View>
  );
};

export default SettingsScreen;
