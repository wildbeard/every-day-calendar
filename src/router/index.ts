import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/CalendarList.vue'),
    },
    {
      path: '/calendars',
      name: 'calendars',
      component: () => import('../views/CalendarList.vue'),
    },
    {
      path: '/calendars/:id',
      props: true,
      component: () => import('../views/CalendarView.vue'),
    },
  ]
})

export default router
