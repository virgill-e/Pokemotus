export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, attempts, pokemonId, pokemonName } = body;

  if (!username || !attempts || !pokemonId || !pokemonName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields',
    });
  }

  const date = getBrusselsDate();
  const db = useDb();

  const stmt = db.prepare(`
    INSERT INTO records (username, attempts, pokemon_id, pokemon_name, date)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(username, attempts, pokemonId, pokemonName, date);

  return { success: true };
});
