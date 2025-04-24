import {z} from "zod";

export const storeNameValidation = z
    .string()
    .min(2, "Store name must be atleast 2 characters")
    .max(20, "Store name must ne no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Store name must not contain special character")

export const registerSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters"})
})

export const loginSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string()
})