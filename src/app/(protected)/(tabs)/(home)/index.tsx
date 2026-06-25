import FeedPostItem from "@/components/FeedPostItem";
import { useAuth } from "@/providers/AuthProvider";
import { getPosts } from "@/services/postService";
import MaterialIcons from "@react-native-vector-icons/material-design-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text } from "react-native";
export default function App() {
  const { session } = useAuth();
  // const isFocused = useIsFocused();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPosts(pageParam, session!.accessToken),
    initialPageParam: { limit: 20, cursor: undefined },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return { limit: 5, cursor: lastPage[lastPage.length - 1].id };
    },
    // subscribed: isFocused,
  });

  // useRefreshOnFocus();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const posts = data?.pages.flat() || [];

  return (
    <>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`} asChild>
            <Pressable>
              <FeedPostItem post={item} />
            </Pressable>
          </Link>
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReachedThreshold={2}
        onEndReached={() => {
          !isFetchingNextPage && hasNextPage && fetchNextPage();
        }}
        ListFooterComponent={() => isFetchingNextPage && <ActivityIndicator />}
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <MaterialIcons name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
