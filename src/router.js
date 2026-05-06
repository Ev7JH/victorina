import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import LoginPage from './views/LoginPage.vue'
import RegisterPage from './views/RegisterPage.vue'
import GamePage from './views/GamePage.vue'
import LeaderboardPage from './views/LeaderboardPage.vue'
import ProfilePage from './views/ProfilePage.vue'


import ProfileInfo from './components/ProfileInfo.vue'
import ProfileHistory from './components/ProfileHistory.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/game', name: 'game', component: GamePage, meta: { requiresAuth: true } },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardPage },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  
    children: [
      { path: '',name: 'profile-info',component: ProfileInfo},
      {path: 'history', name: 'profile-history',component: ProfileHistory}
    ]
  },

  {path: '/:pathMatch(.*)*',name: 'not-found',component: () => import('./views/NotFoundPage.vue')}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('currentUser')
  
  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router