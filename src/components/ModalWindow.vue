<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <slot></slot>
      <button @click="$emit('close')" class="btn btn-secondary mt-3">Закрыть</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, title: String })
defineEmits(['close'])
</script>

