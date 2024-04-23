'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

export const logout = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect("/403")
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export const login = async (formData: z.infer<typeof SignInSchema>) => {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/403')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: z.infer<typeof SignUpSchema>) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/403')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}