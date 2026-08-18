import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

const users = [
  {
    email: 'founder@hexahub.com',
    password: 'Founder@2024!',
    firstName: 'Founder',
    lastName: 'CEO',
    role: 'founder',
  },
  {
    email: 'admin@hexahub.com',
    password: 'Admin@2024!',
    firstName: 'Admin',
    lastName: 'Manager',
    role: 'admin',
  },
  {
    email: 'tester@hexahub.com',
    password: 'Tester@2024!',
    firstName: 'Tester',
    lastName: 'QA',
    role: 'tester',
  },
]

async function seedUsers() {
  console.log('Starting user seeding...')

  for (const user of users) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const userExists = existingUsers?.users.some((u) => u.email === user.email)

      if (userExists) {
        console.log(`✓ User ${user.email} already exists`)
        continue
      }

      // Create user
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          full_name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        },
      })

      if (error) {
        console.error(`✗ Error creating user ${user.email}:`, error.message)
        continue
      }

      console.log(`✓ Created user: ${user.email} (${user.role})`)
      console.log(`  Email: ${user.email}`)
      console.log(`  Password: ${user.password}`)
      console.log(`  Name: ${user.firstName} ${user.lastName}`)
      console.log(`  Role: ${user.role}`)
      console.log('')
    } catch (error) {
      console.error(`✗ Exception for ${user.email}:`, error)
    }
  }

  console.log('User seeding completed!')
}

seedUsers()
