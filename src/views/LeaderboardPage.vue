<script setup>
import { ref, onMounted } from 'vue'
import { useGame } from '../composables/useGame.js'

const { getLeaderboard } = useGame()
const leaders = ref([])

onMounted(() => {
  leaders.value = getLeaderboard()
})
</script>

<template>
  <div class="card">
    <h2 class="leaderboard-title">🏆 Таблица лидеров</h2>
    
    <div v-if="leaders.length === 0" class="empty-leaderboard">
      <p>Пока нет результатов. Будьте первым!</p>
    </div>
    
    <table v-else class="leaderboard-table">
      <thead>
        <tr>
          <th>Место</th>
          <th>Игрок</th>
          <th>Всего баллов</th>
          <th>Игр сыграно</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="leader in leaders" :key="leader.rank">
          <td :class="{ 'rank-1': leader.rank === 1 }">
            <span v-if="leader.rank === 1">👑</span>
            <span v-else-if="leader.rank === 2">🥈</span>
            <span v-else-if="leader.rank === 3">🥉</span>
            <span v-else>{{ leader.rank }}</span>
          </td>
          <td>{{ leader.username }}</td>
          <td class="leader-score">{{ leader.score }}</td>
          <td>{{ leader.gamesPlayed }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>