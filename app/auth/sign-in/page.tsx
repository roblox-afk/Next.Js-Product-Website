"use client"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {Input, Link} from "@nextui-org/react";
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
import { login, SignInSchema } from '@/Actions/auth';

const SignIn = () => {

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        console.log(values)
        login(values)
    }

    return (
        <div className="bg-default-50 shadow-lg shadow-default-50 rounded-xl w-96 h-96 justify-center grid grid-flow-row grid-rows-4">
            <h1 className="font-bold text-center text-3xl my-3">Sign In</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 space-y-6">
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
                    <Button type="submit" className='ml-20 w-1/2'>Submit</Button>
                    <p>
                        Don&apos;t have an account
                        <Link href="/auth/sign-up" className='ml-1'>Register</Link>
                    </p>
                </form>
            </Form>
        </div>
    )
}
export default SignIn;