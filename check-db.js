import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zmpovuorodeifdjmgyyy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcG92dW9yb2RlaWZkam1neXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjU0MTIsImV4cCI6MjA5MzA0MTQxMn0.9-TobKLeQIvSktZiGdwcdct54MfOmiJeOu8mBh6GpEw'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Signing in...")
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'sansnext321@gmail.com',
    password: '123456'
  })
  
  if (authError) {
    console.error("Auth error:", authError)
    return
  }
  console.log("Sign in successful!")

  console.log("Testing GET /user_roles...")
  const { data, error } = await supabase.from('user_roles').select('*')
  if (error) {
    console.error("GET ERROR:", error)
  } else {
    console.log("GET SUCCESS:", data)
  }
  
  console.log("Testing POST /user_roles...")
  const { data: insData, error: insError } = await supabase.from('user_roles').insert({ user_id: authData.session.user.id, role: 'admin' })
  if (insError) {
    console.error("POST ERROR:", insError)
  } else {
    console.log("POST SUCCESS:", insData)
  }
}

test()
