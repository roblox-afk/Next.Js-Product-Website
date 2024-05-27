"use client"
import { TriangleAlert } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LockedShop() {
    const router = useRouter()
    const formSchema = z.object({
        password: z.string().max(100)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        localStorage.setItem("key", values.password)
        router.refresh()
    }

    return (
        <div className="bg-default-100 h-screen">
            <div className="flex justify-center items-center h-[90%]">
                <TriangleAlert fill="#ec9909" strokeWidth={2} absoluteStrokeWidth stroke="#ffffff" className="mr-2" />
                <p>This store is currently under maintenance</p>
            </div>
            <div className="flex justify-center items-center h-[10%] bg-default-200">
                <h1 className="text-large mr-4">Are you the owner? Login to gain access</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="left-1 flex">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="Enter Password" className="bg-default-100 border-default-300 border-2" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="ml-2 bg-transparent border-2 border-default-100 hover:bg-default-100">Enter</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}