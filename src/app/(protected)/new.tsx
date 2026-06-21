import { useAuth } from "@/providers/AuthProvider";
import { createPostRequest } from "@/services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function NewPost() {
  const [content, setContent] = useState("");

  const { session } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      createPostRequest({ content }, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
      router.back();
    },
  });

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Text className="text-lg" onPress={() => router.back()}>
              Cancel
            </Text>
          ),
          headerRight: () => (
            <Button
              onPress={() => mutate()}
              title="Post"
              disabled={content.trim().length === 0 || isPending}
            />
          ),
        }}
      />
      <TextInput
        className="text-lg min-h-40"
        multiline
        placeholder="What's on your mind?"
        value={content}
        autoFocus
        onChangeText={setContent}
      />
    </View>
  );
}
