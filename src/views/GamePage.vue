<script setup>
import { ref, watch } from 'vue'
import { useGame } from '../composables/useGame.js'

const {
  currentQuestion,
  currentScore,
  isGameActive,
  gameFinished,
  currentQuestionNumber,
  currentQuestionPoints,
  progressPercent,
  displayOptions,
  remainingHints,
  activeHints,
  answerStatus,
  startNewGame,
  checkAnswer,
  isAnswerCorrect,
  isAnswerWrong,
  useFiftyFifty,
  useAudienceHelp,
  correctAnswersCount
} = useGame()

const showResultModal = ref(false)
const isGameStarted = ref(false)
const showAudienceModal = ref(false)

function startGame() {
  startNewGame()
  isGameStarted.value = true
  showResultModal.value = false
}

function onUseFiftyFifty() {
  if (remainingHints.value.fiftyFifty > 0) {
    useFiftyFifty()
  }
}

function onUseAudienceHelp() {
  if (remainingHints.value.audienceHelp > 0) {
    useAudienceHelp()
    showAudienceModal.value = true
  }
}

function closeAudienceModal() {
  showAudienceModal.value = false
}

watch(gameFinished, (newVal) => {
  if (newVal && isGameStarted.value) {
    showResultModal.value = true
  }
})

function closeModal() {
  showResultModal.value = false
  isGameStarted.value = false
}
</script>

<template>
  <div class="game-container">
    <div v-if="!isGameStarted" class="card start-card">
      <h2>🎮 Готовы начать?</h2>
      <p>Вас ждут 10 вопросов разной сложности.<br>Отвечайте правильно и зарабатывайте баллы!</p>
      
      <div class="hints-info">
        <h3>💡 Подсказки (каждую можно использовать 1 раз)</h3>
        <div class="hints-icons">
          <div class="hint-icon">
            <div class="hint-icon-emoji">🎲</div>
            <div>50/50</div>
            <div class="hint-icon-desc">Убирает 2 неправильных ответа</div>
          </div>
          <div class="hint-icon">
            <div class="hint-icon-emoji">👥</div>
            <div>Помощь зала</div>
            <div class="hint-icon-desc">Показывает голоса зрителей</div>
          </div>
        </div>
      </div>
      
      <button @click="startGame" class="btn btn-primary start-btn">Начать игру!</button>
    </div>
    
    <div v-else-if="isGameActive && currentQuestion" class="card">
      <div class="progress-section">
        <div class="question-counter">Вопрос {{ currentQuestionNumber }} из 10</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="current-score">🏆 Баллов: {{ currentScore }}</div>
      </div>
      
      <div class="hints-panel">
        <button 
          @click="onUseFiftyFifty" 
          :disabled="remainingHints.fiftyFifty === 0 || answerStatus !== null"
          class="hint-btn"
          :class="{ 'hint-used': remainingHints.fiftyFifty === 0 }"
        >
          🎲 50/50 <span v-if="remainingHints.fiftyFifty > 0">({{ remainingHints.fiftyFifty }})</span>
          <span v-else>(использована)</span>
        </button>
        <button 
          @click="onUseAudienceHelp" 
          :disabled="remainingHints.audienceHelp === 0 || answerStatus !== null"
          class="hint-btn"
          :class="{ 'hint-used': remainingHints.audienceHelp === 0 }"
        >
          👥 Помощь зала <span v-if="remainingHints.audienceHelp > 0">({{ remainingHints.audienceHelp }})</span>
          <span v-else>(использована)</span>
        </button>
      </div>
      
      <div class="question-text">{{ currentQuestion.text }}</div>
      
      <div v-if="showAudienceModal && activeHints.audienceResults" class="audience-modal">
        <div class="audience-content">
          <h3>👥 Результаты голосования зала:</h3>
          <div v-for="(percentage, option) in activeHints.audienceResults" :key="option" class="audience-bar">
            <span class="audience-option">{{ option }}</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: percentage + '%' }"></div>
            </div>
            <span class="audience-percent">{{ percentage }}%</span>
          </div>
          <button @click="closeAudienceModal" class="btn btn-secondary" style="margin-top: 20px; width: 100%;">Закрыть</button>
        </div>
      </div>
      
      <div class="answers-grid">
        <button
          v-for="option in displayOptions"
          :key="option"
          @click="checkAnswer(option)"
          :disabled="answerStatus !== null"
          class="answer-btn"
          :class="{ correct: isAnswerCorrect(option), wrong: isAnswerWrong(option) }"
        >
          {{ option }}
        </button>
      </div>
      
      <div class="answer-feedback">
        <span v-if="answerStatus === 'correct'">✅ Правильно! +{{ currentQuestionPoints }} баллов</span>
        <span v-if="answerStatus === 'wrong'">❌ Неправильно! Правильный ответ: {{ currentQuestion.correct }}</span>
      </div>
    </div>
    
    <div v-if="showResultModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>Игра окончена!</h2>
        <p class="result-score">Ваш результат: <strong>{{ currentScore }}</strong> баллов</p>
        <p>Правильных ответов: {{ correctAnswersCount }} из 10</p>
        <div class="modal-buttons">
          <button @click="startGame" class="btn btn-primary">Сыграть снова</button>
          <RouterLink :to="{ name: 'home' }" class="btn btn-secondary" @click="closeModal">На главную</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

