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
      // Get all products with categories
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .order('name')

      if (error) {
        console.error('Products query error:', error)
        return res.status(500).json({ 
          error: 'Gagal mengambil data produk',
          details: error.message 
        })
      }

      return res.status(200).json({
        success: true,
        data: products || []
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
      const { name, description, price, category_id, image_url, is_active } = req.body

      // Validate required fields
      if (!name || !price) {
        return res.status(400).json({ 
          error: 'Nama produk dan harga wajib diisi' 
        })
      }

      // Create new product
      const { data: product, error } = await supabase
        .from('products')
        .insert([
          {
            name,
            description: description || null,
            price: parseFloat(price),
            category_id: category_id || null,
            image_url: image_url || null,
            is_active: is_active !== undefined ? is_active : true
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Product creation error:', error)
        return res.status(500).json({ 
          error: 'Gagal membuat produk baru',
          details: error.message 
        })
      }

      return res.status(201).json({
        success: true,
        message: 'Produk berhasil dibuat',
        data: product
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