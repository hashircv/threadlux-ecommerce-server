import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
   ssl: {
    rejectUnauthorized: false,
     family: 4
  },
});

pool
  .query("SELECT 1")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });

export const query = (text, params = []) => pool.query(text, params);
