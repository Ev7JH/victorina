<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = !!localStorage.getItem('currentUser')

function startGame() {
  if (isAuthenticated) {
    router.push({ name: 'game' })
  } else {
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div class="card home-card">
    <h1 class="home-title">Добро пожаловать!</h1>
    <p class="home-description">
      Проверьте свои знания и выиграйте баллы!<br>
      Ответьте правильно на 10 вопросов!
    </p>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>10</h3>
        <p>Вопросов</p>
      </div>
      <div class="stat-card">
        <h3>2750</h3>
        <p>Макс. баллов</p>
      </div>
    </div>
    
    <button @click="startGame" class="btn btn-primary start-game-btn">🎮 Начать игру</button>
    
    <div class="how-to-play">
      <h3>Как играть?</h3>
      <p>• У вас есть 10 вопросов разной сложности</p>
      <p>• За каждый правильный ответ вы получаете баллы</p>
      <p>• Баллы растут с каждым вопросом: 50, 100, 150...</p>
      <p>• Ваши результаты сохраняются в истории и таблице лидеров</p>
    </div>
  </div>
</template>