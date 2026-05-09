<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = ref(null)

onMounted(() => {
  const u = localStorage.getItem('currentUser')
  if (u) {
    user.value = JSON.parse(u)
  }
})

function goToInfo() {
  router.push({ name: 'profile-info' })
}

function goToHistory() {
  router.push({ name: 'profile-history' })
}
</script>

<template>
  <div class="card">
    <h2 class="profile-title">👤 Личный кабинет</h2>
    
 
    <div class="profile-tabs">
      <button 
        @click="goToInfo" 
        class="tab-btn"
        :class="{ active: route.name === 'profile-info' || route.name === 'profile' }"
      >
        📊 Информация
      </button>
      <button 
        @click="goToHistory" 
        class="tab-btn"
        :class="{ active: route.name === 'profile-history' }"
      >
        📜 История игр
      </button>
    </div>
    
    
    <RouterView />
  </div>
</template>
