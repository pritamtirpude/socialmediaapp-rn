import FeedPostItem from "@/components/FeedPostItem";
import LucideIcons from "@react-native-vector-icons/lucide";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";
export default function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await fetch("/api/posts");
      const data = await posts.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`}>
            <FeedPostItem post={item} />
          </Link>
        )}
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <LucideIcons name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
