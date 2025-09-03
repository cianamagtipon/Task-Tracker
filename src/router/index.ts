import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '@/components/views/LoginView.vue'
import SignupView from '@/components/views/SignupView.vue'
import BoardView from '@/components/views/BoardView.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/board' },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { public: true },
  },
  { path: '/board', name: 'board', component: BoardView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  return true
})

export default router
