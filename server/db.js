import pg from 'pg'
import 'dotenv/config'

// One connection pool shared by all the routes
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

export default pool
