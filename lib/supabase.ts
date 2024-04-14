import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xejagxlfgsisxdnplcou.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlamFneGxmZ3Npc3hkbnBsY291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMwODQ1NTUsImV4cCI6MjAyODY2MDU1NX0.EVpxXI7V0SCXkxRYEamZPjq6qqWGr9yRQyiYLVTQebE")