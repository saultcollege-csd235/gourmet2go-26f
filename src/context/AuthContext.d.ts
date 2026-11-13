import type { User } from "@supabase/supabase-js";
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
    }) => Promise<{
        data: any;
        error: any;
    }>;
    signInWithEmail: (email: string, password: string) => void;
    signOut: () => void;
}
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
<<<<<<< HEAD
}) => import("react").JSX.Element;
=======
}) => import("react/jsx-runtime").JSX.Element;
>>>>>>> origin/main
export declare const useAuth: () => AuthContextType;
export {};
