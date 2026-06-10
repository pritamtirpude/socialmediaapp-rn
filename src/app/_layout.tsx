import { Stack } from "expo-router";
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
    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Feed" }} />
        <Stack.Screen name="post/[id]" options={{ title: "Post" }} />
      </Stack>
    </ThemeProvider>
  );
}
