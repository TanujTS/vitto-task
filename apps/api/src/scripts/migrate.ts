import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set');
  process.exit(1);
}

async function migrate() {
  const migrationsDir = path.resolve(import.meta.dirname, '../../../../migrations');

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // lexicographic sort: 001, 002, 003...

  if (files.length === 0) {
    console.log('No migration files found in migrations/');
    return;
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to database\n');

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    process.stdout.write(`Running ${file}... `);
    try {
      await client.query(sql);
      console.log('✓');
    } catch (err: any) {
      console.log('❌');
      console.error(`  Error: ${err.message}`);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log('\nAll migrations applied.');
}

migrate();