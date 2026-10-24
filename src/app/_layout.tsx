import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const isUser = await AsyncStorage.getItem("welcomeScreenShown");
      if (!isUser) {
        router.replace("/(adons)/welcome" as unknown as Href);
      }
    };
    checkUser();
  }, [router]);

  // router.replace("/(adons)/welcome" as unknown as Href);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#11111B",
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="bookmarks" />
          <Stack.Screen name="history" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
