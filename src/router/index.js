import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/hobby',
      name: 'hobby',
      component: () => import('../views/HobbyView.vue')
    },
    {
      path: '/add-event',
      name: 'add-event',
      component: () => import('../views/AddEventView.vue')
    },
    {
      path: '/event-details',
      name: 'event-details',
      component: () => import('../views/EventDetailsView.vue')
    }
  ]
})

export default router
