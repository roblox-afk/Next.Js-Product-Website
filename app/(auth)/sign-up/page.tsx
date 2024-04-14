"use client"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {Input} from "@nextui-org/react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation';

const SignUpSchema = z.object({
    username: z.string(),
    email: z.string()
        .min(1, { message: "This field has to be filled."})
        .email("This is not a valid email."),
    password: z.string().min(6)

})

const SignUp = () => {
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(formData: z.infer<typeof SignUpSchema>) {
        console.log(formData)
        let { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        })
        console.log(data)
        console.log(error)
    }

    return (
        <div className="bg-default-50 shadow-lg shadow-default-50 rounded-xl w-96 h-3/6 justify-center grid grid-flow-row grid-rows-4">
            <h1 className="font-bold text-center text-3xl my-3">Sign Up</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input variant='flat' type="username" label="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input variant='flat' type="email" label="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input variant='flat' type="password" className='flex justify-center' label="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='ml-20 w-1/2'>Create Account</Button>
                </form>
            </Form>
        </div>
    )
}
export default SignUp;