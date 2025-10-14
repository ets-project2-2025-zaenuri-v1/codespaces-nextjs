import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for API calls
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing environment variables for Supabase')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ 
      error: 'Metode tidak diizinkan' 
    })
  }

  try {
    // Get authenticated user
    const { userId } = getAuth(req)
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Unauthorized' 
      })
    }

    // For now, we'll create a simple user record without fetching details from Clerk
    // In a real app, you might want to use Clerk's backend API to get user details
    
    // Check if user exists in our users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if user doesn't exist
      console.error('User query error:', userError)
      return res.status(500).json({ 
        error: 'Gagal mengambil data user',
        details: userError.message 
      })
    }

    // If user doesn't exist, create a new user record
    if (!existingUser) {
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            clerk_id: userId,
            email: '', // We'll update this later with actual email
            first_name: null,
            last_name: null,
            role: 'admin', // Default role for new users
            organization_id: '00000000-0000-0000-0000-000000000001' // Default organization
          }
        ])
        .select()
        .single()

      if (createUserError) {
        console.error('User creation error:', createUserError)
        return res.status(500).json({ 
          error: 'Gagal membuat user baru',
          details: createUserError.message 
        })
      }

      return res.status(200).json({
        success: true,
        data: newUser
      })
    }

    return res.status(200).json({
      success: true,
      data: existingUser
    })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      error: 'Kesalahan server internal',
      message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
    })
  }
}