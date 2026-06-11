import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const relativePath = process.argv[2];
  if (!relativePath) {
    console.error("Please provide SQL file path");
    process.exit(1);
  }

  const sqlPath = path.resolve(__dirname, "../../", relativePath);
  const sql = await fs.readFile(sqlPath, "utf-8");

  try {
    await pool.query(sql);
    console.log(`Executed ${relativePath}`);
  } finally {
    await pool.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
