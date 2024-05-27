import { z } from "zod"

export const SignInSchema = z.object({
    email: z.string()
        .min(1, { message: "This field has to be filled."})
        .email("This is not a valid email."),
    password: z.string().min(6)
})

export const SignUpSchema = z.object({
    username: z.string(),
    email: z.string()
        .min(1, { message: "This field has to be filled."})
        .email("This is not a valid email."),
    password: z.string().min(6)
})