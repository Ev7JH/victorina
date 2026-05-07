<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

function register() {
  if (!username.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Заполните все поля'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }
  
  if (password.value.length < 3) {
    errorMessage.value = 'Пароль должен содержать минимум 3 символа'
    return
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  if (users.find(u => u.username === username.value)) {
    errorMessage.value = 'Пользователь с таким именем уже существует'
    return
  }
  
  const newUser = {
    username: username.value,
    password: password.value,
    totalScore: 0,
    history: []
  }
  
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))
  
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="card auth-card">
    <h2 class="auth-title">📝 Регистрация</h2>
    
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <div class="form-group">
      <label>Имя пользователя</label>
      <input type="text" v-model="username" class="form-input" placeholder="Придумайте имя">
    </div>
    
    <div class="form-group">
      <label>Пароль</label>
      <input type="password" v-model="password" class="form-input" placeholder="Придумайте пароль">
    </div>
    
    <div class="form-group">
      <label>Подтверждение пароля</label>
      <input type="password" v-model="confirmPassword" class="form-input" placeholder="Повторите пароль">
    </div>
    
    <button @click="register" class="btn btn-primary register-btn">Зарегистрироваться</button>
    
    <p class="auth-link">Уже есть аккаунт? <RouterLink :to="{ name: 'login' }">Войдите</RouterLink></p>
  </div>
</template>
