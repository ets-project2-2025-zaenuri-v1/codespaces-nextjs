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

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      error: 'ID produk tidak valid' 
    })
  }

  if (req.method === 'GET') {
    try {
      // Get product by ID with category
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Product query error:', error)
        return res.status(500).json({ 
          error: 'Gagal mengambil data produk',
          details: error.message 
        })
      }

      if (!product) {
        return res.status(404).json({ 
          error: 'Produk tidak ditemukan' 
        })
      }

      return res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, price, category_id, image_url, is_active } = req.body

      // Validate at least one field to update
      if (!name && !description && !price && !category_id && !image_url && is_active === undefined) {
        return res.status(400).json({ 
          error: 'Setidaknya satu field harus diisi untuk update' 
        })
      }

      // Build update object with only provided fields
      const updateData: any = {}
      if (name !== undefined) updateData.name = name
      if (description !== undefined) updateData.description = description
      if (price !== undefined) updateData.price = parseFloat(price)
      if (category_id !== undefined) updateData.category_id = category_id
      if (image_url !== undefined) updateData.image_url = image_url
      if (is_active !== undefined) updateData.is_active = is_active

      // Update product
      const { data: product, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Product update error:', error)
        return res.status(500).json({ 
          error: 'Gagal memperbarui produk',
          details: error.message 
        })
      }

      if (!product) {
        return res.status(404).json({ 
          error: 'Produk tidak ditemukan' 
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Produk berhasil diperbarui',
        data: product
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Product deletion error:', error)
        return res.status(500).json({ 
          error: 'Gagal menghapus produk',
          details: error.message 
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Produk berhasil dihapus'
      })
    } catch (error) {
      console.error('API error:', error)
      return res.status(500).json({ 
        error: 'Kesalahan server internal',
        message: error instanceof Error ? error.message : 'Kesalahan tidak diketahui'
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    return res.status(405).json({ 
      error: 'Metode tidak diizinkan' 
    })
  }
}