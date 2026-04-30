<template>
  <div class="h-screen bg-[#c00000] font-['Press_Start_2P'] selection:bg-black/20 overflow-hidden relative flex flex-col">
    <!-- Pokédex Case Top -->
    <div class="w-full bg-[#c00000] pt-2 pb-1 px-4 relative z-20 shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Big Blue Eye (Reduced size) -->
        <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-lg">
          <div class="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-sky-400 border-2 border-sky-600 flex items-center justify-center overflow-hidden relative">
            <div class="absolute top-0.5 left-1 w-3 h-1.5 bg-white/40 rounded-full blur-[1px]"></div>
            <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <div class="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-sky-600"></div>
            </div>
          </div>
        </div>
        
        <!-- Small Lights -->
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
        <!-- Help Button with Hover Legend -->
        <div class="relative group">
          <button @click="showHelp = !showHelp" class="w-5 h-5 rounded-full bg-white/20 text-white text-[8px] flex items-center justify-center hover:bg-white/40 transition-colors border border-white/10 active:scale-95">?</button>
          <!-- Tooltip Legend -->
          <div class="absolute right-0 top-6 w-44 bg-[#303030] border-2 border-white/20 p-2 rounded shadow-2xl transition-all z-50 pointer-events-none"
               :class="[
                 showHelp ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
               ]">
            <div class="text-[6px] text-white space-y-2 leading-loose">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-[#1a1a1a] border border-white/20"></div>
                <span>BONNE PLACE</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-white border border-black"></div>
                <span>MAUVAISE PLACE</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 border border-white/20 opacity-30"></div>
                <span>INEXISTANT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area (Compact) -->
    <main class="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col items-center justify-around overflow-hidden">
      
      <!-- Word Grid (LCD Style) - Scaled to fit width -->
      <div class="w-full max-w-sm bg-[#9ca3af] border-4 border-[#303030] p-2 sm:p-3 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.1)] flex flex-col gap-1 sm:gap-1.5 relative">
        <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: linear-gradient(90deg, #000 1px, transparent 1px); background-size: 4px 100%;"></div>
        
        <div v-for="rowIdx in 6" :key="rowIdx" class="grid grid-cols-7 gap-1">
          <div v-for="colIdx in 7" :key="colIdx" 
               class="aspect-square flex items-center justify-center border-2 text-[12px] sm:text-[14px] transition-all"
               :class="getGridCellClass(rowIdx, colIdx)">
            {{ getGridChar(rowIdx, colIdx) }}
          </div>
        </div>
      </div>

      <!-- Controls & Keyboard Area -->
      <div class="w-full flex flex-col gap-2 sm:gap-4 bg-[#c00000] pb-1 sm:pb-2">
        <!-- Physical Controls Decoration (Hidden on mobile height constraints) -->
        <div class="hidden sm:flex justify-between items-center px-6">
          <div class="relative w-12 h-12">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-12 bg-[#303030] rounded-sm"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-[#303030] rounded-sm"></div>
          </div>
          <div class="flex gap-2">
            <div class="w-6 h-6 rounded-full bg-black shadow-lg border-b-2 border-black/40"></div>
            <div class="w-6 h-6 rounded-full bg-black shadow-lg border-b-2 border-black/40"></div>
          </div>
        </div>

        <!-- Virtual Keyboard (Optimized for width) -->
        <div class="w-full flex flex-col gap-1 sm:gap-1.5 select-none px-1">
          <div v-for="(row, rowIndex) in keyboardRows" :key="rowIndex" class="flex justify-center gap-0.5 sm:gap-1 w-full">
            <button v-for="key in row" :key="key" 
                    class="h-10 sm:h-12 flex items-center justify-center rounded border-b-2 sm:border-b-4 text-[8px] sm:text-[10px] transition-all transform duration-75 active:translate-y-1 active:border-b-0 flex-1 min-w-0"
                    :class="[
                      key.length > 1 ? 'flex-[1.5] text-[7px]' : '',
                      getKeyClass(key),
                      pressedKey === key || (key === 'DELETE' && pressedKey === 'BACKSPACE') ? 'translate-y-1 border-b-0 brightness-110' : ''
                    ]">
              {{ key === 'DELETE' ? 'DEL' : key }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Slot Decor -->
    <div class="w-16 h-1 bg-black/20 rounded-full mx-auto mb-2 sm:mb-4"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const keyboardRows = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DELETE']
]

const showHelp = ref(false)
const pressedKey = ref(null)

const handleKeyDown = (e) => {
  const key = e.key.toUpperCase()
  pressedKey.value = key
}

const handleKeyUp = () => {
  pressedKey.value = null
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

const getGridCellClass = (row, col) => {
  if (row === 1) {
    if ([1, 4].includes(col)) return 'bg-[#1a1a1a] border-[#1a1a1a] text-[#8b956d] shadow-inner'
    if (col === 2) return 'bg-white border-[#1a1a1a] text-[#1a1a1a]'
    return 'border-[#1a1a1a]/30 text-[#1a1a1a]'
  }
  if (row === 2 && col <= 3) return 'border-[#1a1a1a] text-[#1a1a1a] bg-black/5'
  return 'border-[#1a1a1a]/20 text-[#1a1a1a]/20'
}

const getGridChar = (row, col) => {
  const words = [
    ['B', 'U', 'L', 'B', 'I', 'Z', 'A'],
    ['P', 'I', 'K', '', '', '', '']
  ]
  return words[row - 1]?.[col - 1] || ''
}

const getKeyClass = (key) => {
  if (['P', 'I'].includes(key)) return 'bg-[#1a1a1a] border-black text-[#8b956d]'
  if (['A', 'U', 'L', 'B'].includes(key)) return 'bg-white border-slate-400 text-black'
  return 'bg-[#404040] border-black text-[#9ca3af]'
}
</script>

<style>
body {
  margin: 0;
  background-color: #c00000;
}

@keyframes flip {
  0% { transform: rotateX(0); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0); }
}

.cell-flip {
  animation: flip 0.6s ease-in-out;
}
</style>
