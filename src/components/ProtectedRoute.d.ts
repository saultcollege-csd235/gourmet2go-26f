type Role = "NO_ACCESS" | "USER" | "ADMIN";
interface ProtectedRouteProps {
    allowedRoles: Role[];
    delay?: number;
}
export declare const ProtectedRoute: ({ allowedRoles, delay }: ProtectedRouteProps) => import("react/jsx-runtime").JSX.Element;
export {};
