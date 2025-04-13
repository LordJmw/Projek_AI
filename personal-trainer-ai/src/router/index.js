import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RegisterView from '@/views/RegisterView.vue'

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
      component: () => import('../views/DietPage.vue'),
    },
    {
      path : '/register',
      name : "register page",
      component : RegisterView
    },
    {
      path : "/:catchAll(.*)",
      name : "not found",
      component : NotFoundView
    }
  ],
})

export default router
