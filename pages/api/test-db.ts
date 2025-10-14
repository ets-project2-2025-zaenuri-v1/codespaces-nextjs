import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test database connection
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, description')
      .limit(5)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message 
      })
    }

    // Test products with categories
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        categories (
          id,
          name
        )
      `)
      .limit(10)

    if (productsError) {
      console.error('Products query error:', productsError)
      return res.status(500).json({ 
        error: 'Products query failed',
        details: productsError.message 
      })
    }

    // Test ingredients with stock levels
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('id, name, current_stock, min_stock, unit')
      .limit(10)

    if (ingredientsError) {
      console.error('Ingredients query error:', ingredientsError)
      return res.status(500).json({ 
        error: 'Ingredients query failed',
        details: ingredientsError.message 
      })
    }

    // Test dining tables
    const { data: tables, error: tablesError } = await supabase
      .from('dining_tables')
      .select('id, number, capacity, is_active')
      .limit(10)

    if (tablesError) {
      console.error('Tables query error:', tablesError)
      return res.status(500).json({ 
        error: 'Tables query failed',
        details: tablesError.message 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: {
        organizations: data,
        products,
        ingredients,
        tables,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}