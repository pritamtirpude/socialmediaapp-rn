import { AuthProvider } from "@/providers/AuthProvider";
import { Slot } from "expo-router";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import "../../global.css";

export default function RootLayout() {
  const CustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
      primary: "#0A0A0A",
    },
  };
  return (
    <AuthProvider>
      <ThemeProvider value={CustomTheme}>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}
