import { z } from "zod";
export declare const resetPasswordSchema: (t: any) => z.ZodObject<{
    password: z.ZodString;
    confirm_password: z.ZodString;
}, z.core.$strip>;
export type ResetPasswordFormData = z.infer<ReturnType<typeof resetPasswordSchema>>;
export declare const ResetPassword: () => import("react/jsx-runtime").JSX.Element;
