import React, { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "382651467340-vc630gfniq6phif3q8ov202rh65lb3r3.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Login success:", response.authentication);
    } else if (response?.type === "error") {
      console.log("Login error:", response);
    }
  }, [response]);

  return <Button disabled={!request} title="Login with Google" onPress={() => promptAsync()} />;
}