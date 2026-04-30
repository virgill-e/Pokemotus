import { ref, computed } from 'vue'

export const useGame = () => {
  const pokemon = ref(null)
  const guesses = ref([])
  const currentGuess = ref('')
  const maxAttempts = 6
  const loading = ref(true)
  const error = ref(null)

  const isWon = ref(false)
  const isGameOver = ref(false)
  const leaderboard = ref([])
  const username = ref('')

  const fetchDailyPokemon = async () => {
    loading.value = true
    try {
      const data = await $fetch('/api/daily-pokemon')
      pokemon.value = data
      if (pokemon.value?.name) {
        currentGuess.value = pokemon.value.name[0]
      }
      await fetchLeaderboard()
    } catch (err) {
      error.value = err
      console.error('Failed to fetch Pokemon:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchLeaderboard = async () => {
    try {
      leaderboard.value = await $fetch('/api/records')
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    }
  }

  const wordLength = computed(() => pokemon.value?.name?.length || 0)

  const submitGuess = async () => {
    if (isGameOver.value || currentGuess.value.length !== wordLength.value) return
    
    const guess = currentGuess.value
    guesses.value.push(guess)

    if (guess === pokemon.value.name) {
      isWon.value = true
      isGameOver.value = true
    } else if (guesses.value.length >= maxAttempts) {
      isGameOver.value = true
    } else {
      currentGuess.value = pokemon.value.name[0]
    }
  }

  const saveRecord = async () => {
    if (!username.value || !isWon.value) return
    try {
      await $fetch('/api/records', {
        method: 'POST',
        body: {
          username: username.value,
          attempts: guesses.value.length,
          pokemonId: pokemon.value.id,
          pokemonName: pokemon.value.name
        }
      })
      await fetchLeaderboard()
    } catch (err) {
      console.error('Failed to save record:', err)
    }
  }

  const addLetter = (letter: string) => {
    if (isGameOver.value || currentGuess.value.length < wordLength.value) {
      currentGuess.value += letter
    }
  }

  const removeLetter = () => {
    if (isGameOver.value) return
    if (currentGuess.value.length > 1) {
      currentGuess.value = currentGuess.value.slice(0, -1)
    }
  }

  return {
    pokemon,
    guesses,
    currentGuess,
    maxAttempts,
    loading,
    error,
    wordLength,
    isWon,
    isGameOver,
    leaderboard,
    username,
    fetchDailyPokemon,
    submitGuess,
    addLetter,
    removeLetter,
    saveRecord
  }
}
