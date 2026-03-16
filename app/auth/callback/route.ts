import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get user role to determine redirect
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        // All users go to dashboard, admins can access /admin from navigation
        // Only use specific path if provided
        if (next && next !== '/dashboard' && next !== '/admin') {
          return NextResponse.redirect(`${origin}${next}`)
        }
      }
      
      // Default redirect
      return NextResponse.redirect(`${origin}${next ?? '/dashboard'}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
