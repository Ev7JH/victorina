<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const stats = ref({
  totalScore: 0,
  gamesPlayed: 0,
  winRate: 0,
  avgScore: 0
})

onMounted(() => {
  const u = localStorage.getItem('currentUser')
  if (u) {
    user.value = JSON.parse(u)
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u2 => u2.username === user.value.username)
    const history = found?.history || []
    
    stats.value.gamesPlayed = history.length
    stats.value.totalScore = user.value.totalScore || 0
    stats.value.avgScore = stats.value.gamesPlayed > 0 
      ? Math.round(stats.value.totalScore / stats.value.gamesPlayed) 
      : 0
    
    const wins = history.filter(g => g.score >= 2000).length
    stats.value.winRate = stats.value.gamesPlayed > 0 
      ? Math.round((wins / stats.value.gamesPlayed) * 100) 
      : 0
  }
})
</script>

<template>
  <div class="profile-info">
    <div class="avatar-section">
      <div class="avatar">👤</div>
      <h2 class="profile-username">{{ user?.username }}</h2>
      <p class="profile-member-since">Участник с {{ new Date().getFullYear() }} года</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">{{ stats.totalScore }}</div>
        <div class="stat-label">Всего баллов</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">🎮</div>
        <div class="stat-value">{{ stats.gamesPlayed }}</div>
        <div class="stat-label">Игр сыграно</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">📊</div>
        <div class="stat-value">{{ stats.avgScore }}</div>
        <div class="stat-label">Средний балл</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">⭐</div>
        <div class="stat-value">{{ stats.winRate }}%</div>
        <div class="stat-label">Побед (2000+ баллов)</div>
      </div>
    </div>
  </div>
</template>

