import { ref, computed } from 'vue'

export const useGame = () => {
  const pokemon = ref(null)
  const guesses = ref([])
  const currentGuess = ref('')
  const maxAttempts = 6
  const loading = ref(true)
  const error = ref(null)

  const fetchDailyPokemon = async () => {
    loading.value = true
    try {
      const data = await $fetch('/api/daily-pokemon')
      pokemon.value = data
      // Initialize first letter
      if (pokemon.value?.name) {
        currentGuess.value = pokemon.value.name[0]
      }
    } catch (err) {
      error.value = err
      console.error('Failed to fetch Pokemon:', err)
    } finally {
      loading.value = false
    }
  }

  const wordLength = computed(() => pokemon.value?.name?.length || 0)

  const submitGuess = () => {
    if (currentGuess.value.length !== wordLength.value) return
    
    // Logic for validation would go here
    guesses.value.push(currentGuess.value)
    currentGuess.value = pokemon.value.name[0] // Reset to first letter
  }

  const addLetter = (letter: string) => {
    if (currentGuess.value.length < wordLength.value) {
      currentGuess.value += letter
    }
  }

  const removeLetter = () => {
    if (currentGuess.value.length > 1) { // Keep first letter
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
    fetchDailyPokemon,
    submitGuess,
    addLetter,
    removeLetter
  }
}
