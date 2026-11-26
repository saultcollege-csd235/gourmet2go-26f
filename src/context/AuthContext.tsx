
import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { useQuery } from "@tanstack/react-query";
import { cartStore } from "../store/cartStore";

interface AuthContextType {
  user: User | null;
  role?: "NO_ACCESS" | "USER" | "ADMIN";
  roleLoading: boolean;
  roleError: boolean;
  signUpWithEmail: (params: {
    email: string;
    password: string;
    options: {
      data: {
        first_name: string;
        last_name: string;
      };
    };
  }) => Promise<{ data: any; error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role, is_banned")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    return data as {
      role: "NO_ACCESS" | "USER" | "ADMIN";
      is_banned: boolean;
    };
  };

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => fetchUserProfile(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!profile) return;

    if (profile.is_banned || profile.role === "NO_ACCESS") {
      console.warn("Banned/no access user detected. Signing out.");
      signOut();
    }
  }, [profile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signUpWithEmail({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: {
      data: {
        first_name: string;
        last_name: string;
      };
    };
  }) {
    const { first_name, last_name } = options.data;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://gourmet2go.vercel.app/",
        data: {
          first_name,
          last_name,
        },
      },
    });

    return { data, error };
  }

  async function signInWithEmail(
    email: string,
    password: string
  ): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  const signOut = async () => {
    await supabase.auth.refreshSession();
    await supabase.auth.signOut();
    setUser(null);
    cartStore.getState().clearCart();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        roleLoading: isLoading,
        roleError: isError,
        role: profile?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }

  return context;
};
