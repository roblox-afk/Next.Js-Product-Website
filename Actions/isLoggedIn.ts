"use server"

import { supabase } from "@/lib/supabase"

export async function IsLoggedIn() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user)
    return false
}