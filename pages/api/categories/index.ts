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
  // Get authenticated user
  const { userId } = getAuth(req)
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Unauthorized' 
    })
  }

  if (req.method === 'GET') {
    try {
      // Get all categories
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Categories query error:', error)
        return res.status(500).json({ 
          error: 'Gagal mengambil data kategori',
          details: error.message 
        })
      }

      return res.status(200).json({
        success: true,
        data: categories || []
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, color } = req.body

      // Validate required fields
      if (!name) {
        return res.status(400).json({ 
          error: 'Nama kategori wajib diisi' 
        })
      }

      // Create new category
      const { data: category, error } = await supabase
        .from('categories')
        .insert([
          {
            name,
            description: description || null,
            color: color || null
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Category creation error:', error)
        return res.status(500).json({ 
          error: 'Gagal membuat kategori baru',
          details: error.message 
        })
      }

      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil dibuat',
        data: category
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ 
      error: 'Metode tidak diizinkan' 
    })
  }
}