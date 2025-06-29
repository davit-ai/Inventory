import { query } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const result = await query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        p.min_stock_level,
        p.sku,
        p.created_at,
        c.name as category_name,
        c.id as category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `)

    return {
      products: result.rows
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})