<script setup>
import { ref, onMounted } from 'vue'

const history = ref([])
const currentUser = ref(null)

function loadData() {
  const u = localStorage.getItem('currentUser')
  if (u) {
    currentUser.value = JSON.parse(u)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u2 => u2.username === currentUser.value.username)
    history.value = found?.history || []
  }
}

const hintsText = (h) => {
  const used = []
  if (h?.fiftyFifty) used.push(`50/50 (${h.fiftyFifty})`)
  if (h?.audienceHelp) used.push(`помощь зала (${h.audienceHelp})`)
  return used.length ? used.join(', ') : 'Не использованы'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="profile-history">
    <h3 class="history-title">📜 История игр</h3>
    
    <div v-if="!history.length" class="empty-history">
      <p>Вы ещё не играли</p>
      <RouterLink :to="{ name: 'game' }" class="btn btn-primary">Начать игру</RouterLink>
    </div>
    
    <div v-else class="history-list">
      <div v-for="game in history" :key="game.id" class="history-item">
        <div class="history-date">📅 {{ game.date }}</div>
        <div class="history-score">💰 {{ game.score }} баллов</div>
        <div>📊 Ответов: {{ game.questionsAnswered }}/{{ game.totalQuestions }}</div>
        <div class="history-hints">💡 Подсказки: {{ hintsText(game.hintsUsed) }}</div>
        <div class="history-status" :class="{ victory: game.score >= 2000, defeat: game.score < 1000 }">
          {{ game.score >= 2000 ? '🏆 Победа!' : game.score >= 1000 ? '📈 Хороший результат' : '📉 Можно лучше' }}
        </div>
      </div>
    </div>
  </div>
</template>

