import FeedPostItem from "@/components/FeedPostItem";
import { useAuth } from "@/providers/AuthProvider";
import { getPostById } from "@/services/postService";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text } from "react-native";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => getPostById(session!.accessToken, id),
    staleTime: 10 * 1000, // 10 seconds
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Post not found</Text>;
  }

  return <FeedPostItem post={data} />;
}
