import { createServerClient } from '@supabase/ssr' 
import { type NextRequest, NextResponse } from 'next/server'

export const createSupabaseMiddlewareClient = (req: NextRequest) => {

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables (URL or ANON_KEY)");
  }
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: req.cookies
    }
  )
}