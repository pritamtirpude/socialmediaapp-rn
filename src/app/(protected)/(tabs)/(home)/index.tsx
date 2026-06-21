import FeedPostItem from "@/components/FeedPostItem";
import { useAuth } from "@/providers/AuthProvider";
import { getPosts } from "@/services/postService";
import LucideIcons from "@react-native-vector-icons/lucide";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text } from "react-native";
export default function App() {
  const { session } = useAuth();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => getPosts(session!.accessToken),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`} asChild>
            <Pressable>
              <FeedPostItem post={item} />
            </Pressable>
          </Link>
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <LucideIcons name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
