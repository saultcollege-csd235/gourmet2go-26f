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
}) => import("react").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
