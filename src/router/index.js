import { createRouter, createWebHistory } from 'vue-router'
import { logoutHelper } from '@/utils/logoutHelper.js'
import LoginView from '@/views/LoginView.vue'
import { getAuthUser } from '@/utils/authUser.js'
const appName = import.meta.env.VITE_APP_NAME

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        requiresAuth: false,
        title: 'Login',
      },
      component: LoginView,
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Não Encontrado',
      },
    },
    {
      path: '/forgot-password',
      name: 'password.forgot',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Esqueci minha senha',
      },
    },
    {
      path: '/reset-password/:token',
      name: 'password.reset',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: {
        requiresAuth: false,
        title: 'Redefinir senha',
      },
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        requiresAuth: true,
        title: 'Dashboard',
      },
      component: () => import('../views/DashboardView.vue'),
      children: [
        // {
        //   path: '',
        //   name: 'loren',
        // component: () => import('../views/LorenView.vue'),
        // },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = getAuthUser()
  if (to.name === 'login' && user.id) {
    return next({ name: 'home' })
  }
  if (to.meta.requiresAuth && !user.id) {
    logoutHelper(true)
    return
  }
  if (!to.name) {
    next({ name: '404' })
    return
  }

  next()
})
router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} | ${appName}` : appName
})

export default router
