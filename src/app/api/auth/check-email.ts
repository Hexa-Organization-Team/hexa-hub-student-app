import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials')
      return NextResponse.json(
        {
          error: 'Server configuration error',
          exists: null,
        },
        { status: 500 },
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // List all users and check if email exists
    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error listing users:', error)
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
    console.error('Check email error:', error)
    return NextResponse.json(
      {
        error: 'Could not verify email',
        exists: null,
      },
      { status: 500 },
    )
  }
}
