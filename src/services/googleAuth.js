import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "382651467340-nubruhe6cvqh37pqi8fc2725lvk37g16.apps.googleusercontent.com",
    webClientId: "382651467340-nubruhe6cvqh37pqi8fc2725lvk37g16.apps.googleusercontent.com",
  });

  return { request, response, promptAsync };
};