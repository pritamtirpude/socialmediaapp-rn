import { AuthProvider } from "@/providers/AuthProvider";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Slot } from "expo-router";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";

import { useEffect } from "react";
import "../../global.css";

const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  const CustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
      primary: "#0A0A0A",
    },
  };
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={CustomTheme}>
          <Slot />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
