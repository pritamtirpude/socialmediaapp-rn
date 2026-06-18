import { AuthProvider } from "@/providers/AuthProvider";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";

import "../../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);

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
