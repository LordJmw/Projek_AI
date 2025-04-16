import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../dietpage.vue'
import  text from '../components/calender.vue'



const routes = [
  { path: '/', component: HomeView },
  { path: '/text', component: text },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router