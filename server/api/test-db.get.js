import { query } from '~/server/utils/database';

export default defineEventHandler(async (event) => {
  try {
    // Test basic connection
    const result = await query('SELECT NOW() as current_time');

    // Test if tables exist
    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    return {
      success: true,
      message: 'Database connection successful',
      currentTime: result.rows[0].current_time,
      tables: tablesResult.rows.map((row) => row.table_name),
    };
  } catch (error) {
    console.error('Database test error:', error);
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
});
