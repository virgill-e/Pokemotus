export default defineEventHandler(async (event) => {
  const date = new Date().toISOString().split('T')[0];
  const db = useDb();

  const stmt = db.prepare(`
    SELECT username, attempts, created_at
    FROM records
    WHERE date = ?
    ORDER BY attempts ASC, created_at ASC
    LIMIT 10
  `);

  const records = stmt.all(date);

  return records;
});
