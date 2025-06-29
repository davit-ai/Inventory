import { query } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const { name, description, price, stock_quantity, min_stock_level, category_id, sku } = await readBody(event)

    if (!name || price === undefined || stock_quantity === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, price, and stock quantity are required'
      })
    }

    const result = await query(`
      INSERT INTO products (name, description, price, stock_quantity, min_stock_level, category_id, sku)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, description, price, stock_quantity, min_stock_level || 5, category_id || null, sku || null])

    return {
      success: true,
      product: result.rows[0]
    }
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw createError({
        statusCode: 409,
        statusMessage: 'SKU already exists'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})