import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from './db.js';

async function migrate() {
  const sql = fs.readFileSync(path.join(import.meta.dirname, 'schema.sql'), 'utf-8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await pool.query(statement);
      console.log('OK:', statement.split('\n')[0].slice(0, 60));
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'ER_DUP_KEYNAME' || code === 'ER_TABLE_EXISTS_ERROR') {
        console.log('SKIP (already exists):', statement.split('\n')[0].slice(0, 60));
      } else {
        throw err;
      }
    }
  }

  console.log('Migration complete.');
  await pool.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
