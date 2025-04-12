import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

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
      path : "/:catchAll(.*)",
      name : "not found",
      component : NotFoundView
    }
  ],
})

export default router
