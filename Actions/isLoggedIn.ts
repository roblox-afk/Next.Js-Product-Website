"use server"
import { currentUser } from "@clerk/nextjs"

export async function IsLoggedIn() {
    const user = await currentUser()
    return user ? true : false
}