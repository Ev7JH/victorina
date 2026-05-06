import { ref, computed } from 'vue'

const allQuestions = [
  {
    id: 1,
    text: "Какая планета известна как 'Красная планета'?",
    correct: "Марс",
    options: ["Венера", "Марс", "Юпитер", "Сатурн"]
  },
  {
    id: 2,
    text: "Кто написал 'Войну и мир'?",
    correct: "Лев Толстой",
    options: ["Фёдор Достоевский", "Антон Чехов", "Лев Толстой", "Иван Тургенев"]
  },
  {
    id: 3,
    text: "Сколько континентов на Земле?",
    correct: "7",
    options: ["5", "6", "7", "8"]
  },
  {
    id: 4,
    text: "Какой химический элемент имеет символ 'O'?",
    correct: "Кислород",
    options: ["Золото", "Кислород", "Осмий", "Олово"]
  },
  {
    id: 5,
    text: "Кто написал картину 'Мона Лиза'?",
    correct: "Леонардо да Винчи",
    options: ["Винсент Ван Гог", "Пабло Пикассо", "Микеланджело", "Леонардо да Винчи"]
  },
  {
    id: 6,
    text: "Какое самое высокое здание в мире?",
    correct: "Бурдж-Халифа",
    options: ["Эйфелева башня", "Тайбэй 101", "Бурдж-Халифа", "Шанхайская башня"]
  },
  {
    id: 7,
    text: "В каком году началась Вторая мировая война?",
    correct: "1939",
    options: ["1914", "1939", "1941", "1945"]
  },
  {
    id: 8,
    text: "Какое животное является символом Австралии?",
    correct: "Кенгуру",
    options: ["Коала", "Кенгуру", "Утконос", "Ехидна"]
  },
  {
    id: 9,
    text: "Какой язык является самым распространённым в мире?",
    correct: "Китайский",
    options: ["Английский", "Испанский", "Китайский", "Хинди"]
  },
  {
    id: 10,
    text: "Кто изобрёл телефон?",
    correct: "Александр Белл",
    options: ["Томас Эдисон", "Никола Тесла", "Александр Белл", "Гульельмо Маркони"]
  }
]

const scoreMap = {
  1: 50, 2: 100, 3: 150, 4: 200, 5: 250,
  6: 300, 7: 350, 8: 400, 9: 450, 10: 500
}

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function useGame() {
  const currentQuestions = ref([])
  const currentQuestionIndex = ref(0)
  const currentScore = ref(0)
  const correctAnswersCount = ref(0)
  const isGameActive = ref(false)
  const selectedAnswer = ref(null)
  const answerStatus = ref(null)
  const gameFinished = ref(false)
  
  const hintsUsed = ref({ fiftyFifty: 0, audienceHelp: 0 })
  const activeHints = ref({
    fiftyFiftyActive: false,
    eliminatedOptions: [],
    audienceResults: null
  })

  function shuffleOptions(question) {
    return shuffleArray([...question.options])
  }
  
  function startNewGame() {
    const shuffledQuestions = shuffleArray(allQuestions)
    
    currentQuestions.value = shuffledQuestions.map(q => ({
      ...q,
      shuffledOptions: shuffleOptions(q)
    }))
    
    currentQuestionIndex.value = 0
    currentScore.value = 0
    correctAnswersCount.value = 0
    isGameActive.value = true
    gameFinished.value = false
    selectedAnswer.value = null
    answerStatus.value = null
    
    hintsUsed.value = { fiftyFifty: 0, audienceHelp: 0 }
    activeHints.value = {
      fiftyFiftyActive: false,
      eliminatedOptions: [],
      audienceResults: null
    }
  }
  
  const currentQuestion = computed(() => {
    if (currentQuestions.value.length === 0) return null
    return currentQuestions.value[currentQuestionIndex.value]
  })
  
  const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)
  
  const currentQuestionPoints = computed(() => {
    return scoreMap[currentQuestionNumber.value] || 0
  })
  
  const progressPercent = computed(() => {
    return (currentQuestionNumber.value / 10) * 100
  })
  
  const displayOptions = computed(() => {
    if (!currentQuestion.value) return []
    
    if (activeHints.value.fiftyFiftyActive && activeHints.value.eliminatedOptions.length > 0) {
      return currentQuestion.value.shuffledOptions.filter(
        opt => !activeHints.value.eliminatedOptions.includes(opt)
      )
    }
    return currentQuestion.value.shuffledOptions
  })
  
  function checkAnswer(selectedOption) {
    if (!isGameActive.value || answerStatus.value !== null) return
    
    const question = currentQuestion.value
    const isCorrect = selectedOption === question.correct
    selectedAnswer.value = selectedOption
    
    if (isCorrect) {
      answerStatus.value = 'correct'
      currentScore.value += currentQuestionPoints.value
      correctAnswersCount.value++
      
      setTimeout(() => {
        if (currentQuestionNumber.value === 10) {
          finishGame()
        } else {
          nextQuestion()
        }
      }, 1500)
    } else {
      answerStatus.value = 'wrong'
      setTimeout(() => {
        if (currentQuestionNumber.value === 10) {
          finishGame()
        } else {
          nextQuestion()
        }
      }, 1500)
    }
  }
  
  function nextQuestion() {
    if (currentQuestionNumber.value < 10) {
      currentQuestionIndex.value++
      selectedAnswer.value = null
      answerStatus.value = null
      activeHints.value = {
        fiftyFiftyActive: false,
        eliminatedOptions: [],
        audienceResults: null
      }
    }
  }
  
  function finishGame() {
    isGameActive.value = false
    gameFinished.value = true
    
    const gameResult = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      score: currentScore.value,
      questionsAnswered: correctAnswersCount.value,
      totalQuestions: 10,
      hintsUsed: { 
        fiftyFifty: hintsUsed.value.fiftyFifty, 
        audienceHelp: hintsUsed.value.audienceHelp 
      }
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.username === currentUser.username)
      
      if (userIndex !== -1) {
        if (!users[userIndex].history) users[userIndex].history = []
        users[userIndex].history.unshift(gameResult)
        users[userIndex].totalScore = (users[userIndex].totalScore || 0) + currentScore.value
        localStorage.setItem('users', JSON.stringify(users))
        
        currentUser.history = users[userIndex].history
        currentUser.totalScore = users[userIndex].totalScore
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    }
  }
  
  function useFiftyFifty() {
    if (!isGameActive.value || answerStatus.value !== null) return false
    if (hintsUsed.value.fiftyFifty >= 1) return false
    if (activeHints.value.fiftyFiftyActive) return false
    
    const question = currentQuestion.value
    const wrongOptions = question.shuffledOptions.filter(opt => opt !== question.correct)
    const toEliminate = shuffleArray(wrongOptions).slice(0, 2)
    
    activeHints.value.fiftyFiftyActive = true
    activeHints.value.eliminatedOptions = toEliminate
    hintsUsed.value.fiftyFifty++
    
    return true
  }
  
  function useAudienceHelp() {
    if (!isGameActive.value || answerStatus.value !== null) return false
    if (hintsUsed.value.audienceHelp >= 1) return false
    if (activeHints.value.audienceResults !== null) return false
    
    const question = currentQuestion.value
    const results = {}
    const correctPercentage = Math.floor(Math.random() * 26) + 60
    let remainingPercentage = 100 - correctPercentage
    const wrongOptions = question.shuffledOptions.filter(opt => opt !== question.correct)
    
    results[question.correct] = correctPercentage
    
    wrongOptions.forEach((opt, index) => {
      if (index === wrongOptions.length - 1) {
        results[opt] = remainingPercentage
      } else {
        const percentage = Math.floor(Math.random() * (remainingPercentage - (wrongOptions.length - index - 1))) + 1
        results[opt] = percentage
        remainingPercentage -= percentage
      }
    })
    
    activeHints.value.audienceResults = results
    hintsUsed.value.audienceHelp++
    
    return true
  }
  
  const remainingHints = computed(() => ({
    fiftyFifty: 1 - hintsUsed.value.fiftyFifty,
    audienceHelp: 1 - hintsUsed.value.audienceHelp
  }))
  
  function getUserHistory(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username)
    return user?.history || []
  }
  
  function getLeaderboard() {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    return users
      .filter(u => u.totalScore > 0)
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
      .slice(0, 10)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.totalScore || 0,
        gamesPlayed: user.history?.length || 0
      }))
  }
  
  function isAnswerCorrect(option) {
    if (selectedAnswer.value === null) return false
    if (answerStatus.value === 'correct' && option === currentQuestion.value.correct) return true
    return false
  }
  
  function isAnswerWrong(option) {
    if (selectedAnswer.value === null) return false
    if (answerStatus.value === 'wrong' && option === selectedAnswer.value) return true
    return false
  }
  
  return {
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
    correctAnswersCount,
    selectedAnswer,
    startNewGame,
    checkAnswer,
    getUserHistory,
    getLeaderboard,
    isAnswerCorrect,
    isAnswerWrong,
    useFiftyFifty,
    useAudienceHelp
  }
}