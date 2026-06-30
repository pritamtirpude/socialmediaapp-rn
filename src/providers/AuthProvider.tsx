import { signInRequest } from "@/services/authService";
import { User } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

type Session = {
  user: User;
  accessToken: string;
};

const AuthContext = createContext<{
  signIn: (handle: string) => void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

const avatar =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.png";

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();

  const { mutate: signIn } = useMutation({
    mutationFn: (handle: string) => signInRequest(handle),
    onSuccess: (data) => {
      setSession(data);
      saveSession(data);
    },
  });

  useEffect(() => {
    loadSession();
  }, []);

  // const signIn = (handle: string) => {
  //   const session: Session = {
  //     user: {
  //       id: "383bd451-9df3-4508-b216-ac87cdfed90e",
  //       name: "Vadim Savin",
  //       handle,
  //       avatar,
  //     },
  //     accessToken:
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4M2JkNDUxLTlkZjMtNDUwOC1iMjE2LWFjODdjZGZlZDkwZSIsImlhdCI6MTc4MjAzNTU3OCwiZXhwIjoxNzg0NjI3NTc4fQ.lnaCY64HKuZjI_lhrMVh1QMDGnmy9yubwxdc9o4feUg",
  //   };
  //   setSession(session);
  //   saveSession(session);
  // };

  const signOut = () => {
    queryClient.clear();
    setSession(null);
    saveSession(null);
  };

  const saveSession = async (session: Session | null) => {
    if (Platform.OS === "web") {
      if (session) {
        localStorage.setItem("session", JSON.stringify(session));
      } else {
        localStorage.removeItem("session");
      }
    } else {
      if (session) {
        await SecureStore.setItemAsync("session", JSON.stringify(session));
      } else {
        await SecureStore.deleteItemAsync("session");
      }
    }
  };

  const loadSession = async () => {
    if (Platform.OS === "web") {
      const sessionData = localStorage.getItem("session");
      if (sessionData) {
        setSession(JSON.parse(sessionData));
      } else {
        setSession(null);
      }
    } else {
      const sessionData = await SecureStore.getItemAsync("session");

      if (sessionData) {
        setSession(JSON.parse(sessionData));
      } else {
        setSession(null);
      }
    }

    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
