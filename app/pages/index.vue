<template>
  <div class="h-screen bg-[#c00000] font-['Press_Start_2P'] selection:bg-black/20 overflow-hidden relative flex flex-col">
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 z-50 bg-[#c00000] flex flex-col items-center justify-center gap-6">
      <div class="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
      <p class="text-white text-[10px]">CHARGEMENT...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="absolute inset-0 z-50 bg-[#c00000] flex flex-col items-center justify-center gap-6 text-center p-8">
      <p class="text-white text-[10px] leading-loose">ERREUR DE CONNEXION AU CENTRE POKEMON</p>
      <button @click="fetchDailyPokemon" class="px-4 py-2 bg-white text-[#c00000] text-[8px] rounded-lg">REESSAYER</button>
    </div>

    <!-- Win/Leaderboard Overlay -->
    <div v-if="isGameOver" class="absolute inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
      <div class="w-full max-w-sm bg-[#9ca3af] border-8 border-[#303030] p-4 rounded-xl flex flex-col gap-4 text-[#1a1a1a] shadow-2xl relative">
        <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: linear-gradient(#000 1px, transparent 1px); background-size: 100% 4px;"></div>
        
        <div class="text-center">
          <h2 class="text-xs mb-2">{{ isWon ? 'BRAVO !' : 'DOMMAGE...' }}</h2>
          <p class="text-[8px] mb-4">C'ÉTAIT {{ pokemon?.name }}</p>
        </div>

        <!-- Registration form if won -->
        <div v-if="isWon && !recordSaved" class="bg-black/5 p-3 border-2 border-[#1a1a1a] rounded flex flex-col gap-3">
          <p class="text-[6px] text-center">ENREGISTRE TON SCORE</p>
          <input v-model="username" 
                 placeholder="PSEUDO" 
                 maxlength="10"
                 class="w-full bg-[#8b956d] border-2 border-[#1a1a1a] p-2 text-[10px] focus:outline-none placeholder:text-black/30" />
          <button @click="handleSave" 
                  class="bg-[#1a1a1a] text-[#8b956d] p-2 text-[8px] border-b-4 border-black hover:brightness-110 active:translate-y-0.5 active:border-b-0">
            VALIDER
          </button>
        </div>

        <!-- Leaderboard -->
        <div class="flex-1 flex flex-col gap-2">
          <h3 class="text-[7px] border-b-2 border-[#1a1a1a]/20 pb-1">RECORDS DU JOUR</h3>
          <div class="space-y-2 overflow-y-auto max-h-[150px] pr-2">
            <div v-for="(rec, i) in leaderboard" :key="i" class="flex justify-between text-[6px]">
              <span class="truncate max-w-[100px]">{{ i + 1 }}. {{ rec.username }}</span>
              <span>{{ rec.attempts }} ESSAIS</span>
            </div>
            <p v-if="leaderboard.length === 0" class="text-[6px] text-center opacity-50 py-4">AUCUN RECORD</p>
          </div>
        </div>

        <button @click="isGameOver = false" class="text-[6px] text-center mt-2 underline opacity-50 font-bold">FERMER</button>
      </div>
    </div>

    <!-- Main Game Interface -->
    <div v-if="!loading && !error" class="flex-1 flex flex-col overflow-hidden">
      <!-- Pokédex Case Top -->
      <div class="w-full bg-[#c00000] pt-2 pb-1 px-4 relative z-20 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-lg">
            <div class="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-sky-400 border-2 border-sky-600 flex items-center justify-center overflow-hidden relative">
              <div class="absolute top-0.5 left-1 w-3 h-1.5 bg-white/40 rounded-full blur-[1px]"></div>
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-sky-500 flex items-center justify-center">
                <div class="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-sky-600"></div>
              </div>
            </div>
          </div>
          
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500 border border-red-900 shadow-[0_0_4px_rgba(239,68,68,0.8)]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-800 shadow-[0_0_4px_rgba(250,204,21,0.8)] animate-pulse"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-900 shadow-[0_0_4px_rgba(34,197,94,0.8)]"></div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <h1 class="text-white text-[8px] sm:text-xs tracking-tighter drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
            POKÉMOTUS
          </h1>
          <div class="relative group">
            <button @click="showHelp = !showHelp" class="w-5 h-5 rounded-full bg-white/20 text-white text-[8px] flex items-center justify-center hover:bg-white/40 transition-colors border border-white/10 active:scale-95">?</button>
            <div class="absolute right-0 top-6 w-44 bg-[#303030] border-2 border-white/20 p-2 rounded shadow-2xl transition-all z-50 pointer-events-none"
                 :class="[showHelp ? 'opacity-100 scale-100' : 'opacity-0 scale-95']">
              <div class="text-[6px] text-white space-y-2 leading-loose">
                <div class="flex items-center gap-2"><div class="w-3 h-3 bg-[#1a1a1a] border border-white/20"></div><span>BONNE PLACE</span></div>
                <div class="flex items-center gap-2"><div class="w-3 h-3 bg-white border border-black"></div><span>MAUVAISE PLACE</span></div>
                <div class="flex items-center gap-2"><div class="w-3 h-3 border border-white/20 opacity-30"></div><span>INEXISTANT</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main class="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center justify-around overflow-hidden">
        <!-- Word Grid -->
        <div v-if="wordLength > 0" class="w-full max-w-sm bg-[#9ca3af] border-4 border-[#303030] p-2 sm:p-3 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.1)] flex flex-col gap-1 sm:gap-1.5 relative">
          <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: linear-gradient(90deg, #000 1px, transparent 1px); background-size: 4px 100%;"></div>
          
          <div v-for="rowIdx in maxAttempts" :key="rowIdx" 
               class="grid gap-1" 
               :style="{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }">
            <div v-for="colIdx in wordLength" :key="colIdx" 
                 class="aspect-square flex items-center justify-center border-2 text-[10px] sm:text-[14px] transition-all"
                 :class="getCellClass(rowIdx, colIdx)">
              {{ getCellChar(rowIdx, colIdx) }}
            </div>
          </div>
        </div>
        <div v-else class="text-white text-[8px]">INITIALISATION...</div>

        <!-- Keyboard Area -->
        <div class="w-full flex flex-col gap-2 sm:gap-4 bg-[#c00000] pb-1 sm:pb-2">
          <div class="w-full flex flex-col gap-1 sm:gap-1.5 select-none px-1">
            <div v-for="(row, rowIndex) in keyboardRows" :key="rowIndex" class="flex justify-center gap-0.5 sm:gap-1 w-full">
              <button v-for="key in row" :key="key" 
                      @click="handleInput(key)"
                      class="h-10 sm:h-12 flex items-center justify-center rounded border-b-2 sm:border-b-4 text-[8px] sm:text-[10px] transition-all transform duration-75 active:translate-y-1 active:border-b-0 flex-1 min-w-0"
                      :class="[
                        key.length > 1 ? 'flex-[1.5] text-[7px]' : '',
                        getKeyColorClass(key),
                        pressedKey === key || (key === 'DELETE' && pressedKey === 'BACKSPACE') ? 'translate-y-1 border-b-0 brightness-110' : ''
                      ]">
                {{ key === 'DELETE' ? 'DEL' : key }}
              </button>
            </div>
          </div>
        </div>
      </main>

      <div class="w-16 h-1 bg-black/20 rounded-full mx-auto mb-2 sm:mb-4"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGame } from '~/composables/useGame'

const { 
  pokemon, guesses, currentGuess, maxAttempts, 
  loading, error, wordLength, fetchDailyPokemon,
  addLetter, removeLetter, submitGuess,
  isWon, isGameOver, leaderboard, username, saveRecord
} = useGame()

const recordSaved = ref(false)
const showHelp = ref(false)
const pressedKey = ref(null)

const keyboardRows = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DELETE']
]

const handleSave = async () => {
  await saveRecord()
  recordSaved.value = true
}

const handleInput = (key) => {
  if (key === 'ENTER') submitGuess()
  else if (key === 'DELETE') removeLetter()
  else if (key.length === 1) addLetter(key)
}

const handleKeyDown = (e) => {
  if (isGameOver.value) return
  const key = e.key.toUpperCase()
  pressedKey.value = key
  if (key === 'ENTER') submitGuess()
  else if (key === 'BACKSPACE') removeLetter()
  else if (/^[A-Z]$/.test(key)) addLetter(key)
}

const handleKeyUp = () => { pressedKey.value = null }

onMounted(() => {
  fetchDailyPokemon()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

const getCellChar = (rowIdx, colIdx) => {
  const attemptIdx = rowIdx - 1
  if (attemptIdx < guesses.value.length) return guesses.value[attemptIdx][colIdx - 1]
  if (attemptIdx === guesses.value.length) return currentGuess.value[colIdx - 1] || (colIdx === 1 ? pokemon.value?.name[0] : '.')
  return colIdx === 1 ? pokemon.value?.name[0] : '.'
}

const getCellClass = (rowIdx, colIdx) => {
  const attemptIdx = rowIdx - 1
  const char = getCellChar(rowIdx, colIdx)
  if (attemptIdx < guesses.value.length) {
    const target = pokemon.value.name
    if (char === target[colIdx - 1]) return 'bg-[#1a1a1a] border-[#1a1a1a] text-[#8b956d] shadow-inner'
    if (target.includes(char)) return 'bg-white border-[#1a1a1a] text-[#1a1a1a]'
    return 'border-[#1a1a1a]/30 text-[#1a1a1a]'
  }
  if (attemptIdx === guesses.value.length) {
    if (colIdx <= currentGuess.value.length) return 'border-[#1a1a1a] text-[#1a1a1a] bg-black/5'
  }
  return 'border-[#1a1a1a]/10 text-[#1a1a1a]/10'
}

const getKeyColorClass = (key) => {
  if (key === 'ENTER') return 'bg-blue-600 border-blue-800 text-white'
  return 'bg-[#404040] border-black text-[#9ca3af]'
}
</script>

<style>
body { margin: 0; background-color: #c00000; }
@keyframes flip { 0% { transform: rotateX(0); } 50% { transform: rotateX(90deg); } 100% { transform: rotateX(0); } }
.cell-flip { animation: flip 0.6s ease-in-out; }
</style>
