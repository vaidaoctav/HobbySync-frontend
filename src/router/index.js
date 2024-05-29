import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axios from 'axios'
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
      component: () => import('../views/ProfileView.vue'),
      meta:{requiresAuth:true}
    },
    {
      path: '/hobby',
      name: 'hobby',
      component: () => import('../views/HobbyView.vue'),
      meta:{requiresAuth:true}

    },
    {
      path: '/add-event',
      name: 'add-event',
      component: () => import('../views/AddEventView.vue'),
      meta:{requiresAuth:true}

    },
    {
      path: '/event-details/:id',
      name: 'event-details',
      component: () => import('../views/EventDetailsView.vue'),
      meta:{requiresAuth:true}

    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    axios.get('http://localhost:8080/hobby-sync/auth/validate-session', { withCredentials: true })
      .then(() => {
        next();
      })
      .catch(() => {
        next('/login');
      });
  } else {
    next();
  }
});

export default router
