<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)

function updateUser() {
  const user = localStorage.getItem('currentUser')
  currentUser.value = user ? JSON.parse(user) : null
}

onMounted(() => {
  updateUser()
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
      updateUser()
    }
  })
})

router.beforeEach((to, from, next) => {
  updateUser()
  next()
})

const isAuthenticated = computed(() => !!currentUser.value)

function logout() {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="main-header">
    <RouterLink :to="{ name: 'home' }" class="logo-link">
      <div class="logo">Brain Battle</div>
    </RouterLink>
    <nav class="nav-links">
      <RouterLink :to="{ name: 'home' }" class="nav-link">Главная</RouterLink>
      <RouterLink :to="{ name: 'leaderboard' }" class="nav-link">🏆 Таблица лидеров</RouterLink>
      <RouterLink v-if="isAuthenticated" :to="{ name: 'game' }" class="nav-link">🎮 Играть</RouterLink>
      <RouterLink v-if="isAuthenticated" :to="{ name: 'profile' }" class="nav-link">👤 Личный кабинет</RouterLink>
      <RouterLink v-if="!isAuthenticated" :to="{ name: 'login' }" class="nav-link">🔐 Вход</RouterLink>
      <RouterLink v-if="!isAuthenticated" :to="{ name: 'register' }" class="nav-link">📝 Регистрация</RouterLink>
    </nav>
    <div v-if="isAuthenticated" class="user-info">
      <span class="user-name">{{ currentUser?.username }}</span>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>
  </header>
  <div class="container">
    <RouterView />
  </div>
</template>
