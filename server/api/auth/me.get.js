import jwt from 'jsonwebtoken'
import { query } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret)

    // Get user from database
    const result = await query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    return {
      user: result.rows[0]
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})