import { useAuth } from "@/providers/AuthProvider";
import { likePostRequest, unlikePostRequest } from "@/services/postService";
import { Post } from "@/types/models";
import LucideIcons from "@react-native-vector-icons/lucide";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image, Text, View } from "react-native";

dayjs.extend(relativeTime);

type FeedPostItemProps = {
  post: Post;
};

export default function FeedPostItem({ post }: FeedPostItemProps) {
  const { session } = useAuth();

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likePostRequest(post.id, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePostRequest(post.id, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <View className="flex-row gap-3 p-4 border-b border-gray-200">
      <Image
        source={{ uri: post.author.avatar }}
        className="size-12 rounded-full"
      />
      <View className="gap-1 flex-1">
        <View className="flex-row gap-1">
          <Text className="font-semibold">{post.author.name}</Text>
          <Text className="text-gray-500">@{post.author.handle}</Text>
          <Text className="text-gray-500">·</Text>
          <Text className="text-gray-500">
            {dayjs(post.created_at).fromNow()}
          </Text>
        </View>
        <Text className="leading-5">{post.content}</Text>

        <View className="flex-row gap-4">
          <View className="flex-row items-center gap-1">
            <LucideIcons name="message-circle" size={20} color="gray" />
            <Text className="text-gray-500">{post.replies_count}</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <LucideIcons name="repeat-2" size={20} color="gray" />
            <Text className="text-gray-500">{post.retweets_count}</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <LucideIcons
              onPress={() =>
                post.is_liked ? unlikeMutation.mutate() : likeMutation.mutate()
              }
              name={post.is_liked ? "heart" : "heart"}
              size={20}
              color={post.is_liked ? "crimson" : "gray"}
            />
            <Text className="text-gray-500">{post.likes_count}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
