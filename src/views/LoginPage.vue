<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

function login() {
  if (!username.value || !password.value) {
    errorMessage.value = 'Заполните все поля'
    return
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.username === username.value && u.password === password.value)
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    router.push({ name: 'home' })
  } else {
    errorMessage.value = 'Неверное имя пользователя или пароль'
  }
}
</script>

<template>
  <div class="card auth-card">
    <h2 class="auth-title">🔐 Вход в игру</h2>
    
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <div class="form-group">
      <label>Имя пользователя</label>
      <input type="text" v-model="username" class="form-input" placeholder="Введите имя">
    </div>
    
    <div class="form-group">
      <label>Пароль</label>
      <input type="password" v-model="password" class="form-input" placeholder="Введите пароль" @keyup.enter="login">
    </div>
    
    <button @click="login" class="btn btn-primary login-btn">Войти</button>
    
    <p class="auth-link">Нет аккаунта? <RouterLink :to="{ name: 'register' }">Зарегистрируйтесь</RouterLink></p>
  </div>
</template>

