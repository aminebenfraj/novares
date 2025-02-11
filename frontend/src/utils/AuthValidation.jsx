import { z } from "zod";

// ✅ Define Register Schema
export const registerSchema = z
  .object({
    license: z.string().min(1, "License is required"), 
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirmation: z.string().min(6, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"], 
  });

// ✅ Define Login Schema
export const loginSchema = z.object({
  license: z.string().min(1, "License is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
