import { ref, computed, watch } from 'vue'

export const useGame = () => {
  const pokemon = ref(null)
  const guesses = ref([])
  const currentGuess = ref('')
  const maxAttempts = 6
  const loading = ref(true)
  const error = ref(null)

  const isWon = ref(false)
  const isGameOver = ref(false)
  const isRecordSaved = ref(false)
  const leaderboard = ref([])
  const username = ref('')

  // Persistence Cookie
  const gameCookie = useCookie('pokemotus_state', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    watch: true
  })

  const fetchDailyPokemon = async () => {
    loading.value = true
    try {
      const data = await $fetch('/api/daily-pokemon')
      pokemon.value = data
      
      const today = data.date // This is the Brussels date from API
      
      // Restore from cookie if it's the same day
      if (gameCookie.value && gameCookie.value.date === today) {
        guesses.value = gameCookie.value.guesses || []
        isWon.value = gameCookie.value.isWon || false
        isGameOver.value = gameCookie.value.isGameOver || false
        isRecordSaved.value = gameCookie.value.isRecordSaved || false
        username.value = gameCookie.value.username || ''
      }

      if (!isGameOver.value && pokemon.value?.name) {
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

  // Watch for state changes to update cookie
  watch([guesses, isWon, isGameOver, isRecordSaved, username, pokemon], () => {
    if (pokemon.value?.date) {
      gameCookie.value = {
        date: pokemon.value.date,
        guesses: guesses.value,
        isWon: isWon.value,
        isGameOver: isGameOver.value,
        isRecordSaved: isRecordSaved.value,
        username: username.value
      }
    }
  }, { deep: true })

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
    if (!username.value || !isWon.value || isRecordSaved.value) return
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
      isRecordSaved.value = true
      await fetchLeaderboard()
    } catch (err) {
      console.error('Failed to save record:', err)
    }
  }

  const addLetter = (letter: string) => {
    if (isGameOver.value) return
    if (currentGuess.value.length < wordLength.value) {
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
    isRecordSaved,
    leaderboard,
    username,
    fetchDailyPokemon,
    submitGuess,
    addLetter,
    removeLetter,
    saveRecord
  }
}
