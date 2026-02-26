import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import schema from '@/db/entity-relations';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create the connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Initialize Drizzle ORM
export const db = drizzle(client, { schema });

export default db;
