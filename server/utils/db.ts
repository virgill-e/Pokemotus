import Database from 'better-sqlite3';
import { join } from 'path';

let db: any = null;

export const useDb = () => {
  if (!db) {
    // In production, you might want to use a persistent path
    // For local dev, it creates 'records.db' in the root
    db = new Database('records.db');
    
    // Create table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        attempts INTEGER NOT NULL,
        pokemon_id INTEGER NOT NULL,
        pokemon_name TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
};
