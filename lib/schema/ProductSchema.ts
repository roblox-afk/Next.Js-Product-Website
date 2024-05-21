"use client"
import { z } from "zod"

export const ProductSchema = z.object({
    title: z.string().superRefine((val, ctx) => {
        if (val.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 5,
                type: "string",
                inclusive: true,
                message: "Must be 5 or more characters long"
            })
        }

        if (val.length > 255) {
            ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                maximum: 255,
                type: "string",
                inclusive: true,
                message: "Must be less than 255 characters"
            })
        }
    }),
    description: z.string().min(5, {"message": "Too short of a description. Minimum 5 characters."}),
    price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    category: z.string(),
    isFeatured: z.boolean()
})