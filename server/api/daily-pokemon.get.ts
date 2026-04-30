export default defineEventHandler(async (event) => {
  // Extract preferred language from header (e.g., "fr-FR" -> "fr")
  const acceptLanguage = getHeader(event, 'accept-language') || 'en';
  const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();

  // Configurable range: Gen 1 by default (1 to 151)
  const MIN_ID = 1;
  const MAX_ID = 151;

  // Use the current date (YYYY-MM-DD) as a seed
  const date = new Date();
  const dateString = date.toISOString().split('T')[0];
  
  const getSeedFromDate = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = getSeedFromDate(dateString);
  const pokemonId = (seed % (MAX_ID - MIN_ID + 1)) + MIN_ID;

  try {
    const pokemon: any = await $fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const species: any = await $fetch(pokemon.species.url);
    
    // Find localized name based on preferred language, fallback to English then to base name
    const localizedName = species.names.find((n: any) => n.language.name === preferredLang)?.name 
                       || species.names.find((n: any) => n.language.name === 'en')?.name
                       || pokemon.name;

    return {
      id: pokemon.id,
      name: localizedName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      types: pokemon.types.map((t: any) => t.type.name),
      date: dateString,
      sprite: pokemon.sprites.front_default,
      lang: preferredLang
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch Pokemon of the day',
    });
  }
});
