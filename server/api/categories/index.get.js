import { query } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const result = await query(`
      SELECT id, name, description, created_at
      FROM categories
      ORDER BY name ASC
    `)

    return {
      categories: result.rows
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})