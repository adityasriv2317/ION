import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/stores/themeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const router = useRouter();
  const { colorScheme, colors } = useTheme();

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
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <GestureHandlerRootView>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="tabs" />
          <Stack.Screen name="bookmarks" />
          <Stack.Screen name="history" />
          <Stack.Screen name="settings" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
