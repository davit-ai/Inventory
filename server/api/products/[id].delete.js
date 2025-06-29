import { query } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const productId = getRouterParam(event, 'id')

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [productId]
    )

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    return {
      success: true,
      message: 'Product deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to delete product'
    })
  }
})