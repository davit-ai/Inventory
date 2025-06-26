import pkg from 'pg';
const { Pool } = pkg;

let pool = null;

export function getDatabase() {
  if (!pool) {
    const config = useRuntimeConfig();

    pool = new Pool({
      host: config.dbHost,
      port: parseInt(config.dbPort),
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

export async function query(text, params) {
  const pool = getDatabase();
  const client = await pool.connect();

  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
