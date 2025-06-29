import { query } from '~/server/utils/database';

export default defineEventHandler(async (event) => {
  try {
    // Get total products
    const productsResult = await query(
      'SELECT COUNT(*) as count FROM products'
    );
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get total stock
    const stockResult = await query(
      'SELECT SUM(stock_quantity) as total FROM products'
    );
    const totalStock = parseInt(stockResult.rows[0].total) || 0;

    // Get low stock items
    const lowStockResult = await query(
      'SELECT COUNT(*) as count FROM products WHERE stock_quantity <= min_stock_level'
    );
    const lowStock = parseInt(lowStockResult.rows[0].count);

    // Get total categories
    const categoriesResult = await query(
      'SELECT COUNT(*) as count FROM categories'
    );
    const totalCategories = parseInt(categoriesResult.rows[0].count);

    return {
      totalProducts,
      totalStock,
      lowStock,
      totalCategories,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics',
    });
  }
});
