import { query } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const { name, description } = await readBody(event)

    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category name is required'
      })
    }

    const result = await query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name, description || null])

    return {
      success: true,
      category: result.rows[0]
    }
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw createError({
        statusCode: 409,
        statusMessage: 'Category name already exists'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create category'
    })
  }
})