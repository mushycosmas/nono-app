import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {

  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "382651467340-nubruhe6cvqh37pqi8fc2725lvk37g16.apps.googleusercontent.com",
    webClientId: "382651467340-nubruhe6cvqh37pqi8fc2725lvk37g16.apps.googleusercontent.com",

    redirectUri,
    useProxy: true,
  });

  return { request, response, promptAsync };
};