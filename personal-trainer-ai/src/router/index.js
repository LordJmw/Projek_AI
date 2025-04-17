import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import DietView from '@/components/DietView.vue'
import WorkoutView from '@/views/workoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/diet',
      name: 'diet page',
      component: () => DietView
    },
    {
      path : '/workout',
      name : "workout page",
      component : WorkoutView
    },
    {
      path : '/register',
      name : "register page",
      component : RegisterView
    },
    {
      path : "/login",
      name : "login page",
      component : LoginView
    },
    {
      path : "/:catchAll(.*)",
      name : "not found",
      component : NotFoundView
    }
  ],
})

export default router
