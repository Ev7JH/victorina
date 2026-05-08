<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="not-found">
    <div class="card error-card">
      <div class="error-code">404</div>
      <h1 class="error-title">Страница не найдена</h1>
      <p class="error-text">
        Извините, страница, которую вы ищете, не существует или была перемещена.
      </p>
      <button @click="goHome" class="btn btn-primary">
        🏠 Вернуться на главную
      </button>
    </div>
  </div>
</template>
