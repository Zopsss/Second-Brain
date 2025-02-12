import { z } from "zod";

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters long.",
      })
      .max(20, {
        message: "Username should not be longer than 20 characters.",
      }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .max(20, {
        message: "Password should not be longer than 20 characters.",
      })
      .refine((pass) => /[a-z]/.test(pass), {
        message: "Password should contain at least one lowercase character",
      })
      .refine((pass) => /[A-Z]/.test(pass), {
        message: "Password should contain at least one uppercase character.",
      })
      .refine((pass) => /[0-9]/.test(pass), {
        message: "Password should contain at least one digit.",
      })
      .refine((pass) => /[#?!@$%^&*-]/.test(pass), {
        message: "Password should contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password didn't match.",
    path: ["confirmPassword"],
  });

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
