import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    )

    // Query auth.users table using admin API
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      return NextResponse.json(
        {
          error: 'Could not verify email',
          exists: null,
        },
        { status: 500 },
      )
    }

    const userExists = data.users.some((user) => user.email?.toLowerCase() === email.toLowerCase())

    return NextResponse.json({
      exists: userExists,
      email: email.toLowerCase(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Could not verify email',
        exists: null,
      },
      { status: 500 },
    )
  }
}
