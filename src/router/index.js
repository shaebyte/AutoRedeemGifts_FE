import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ModLogin from '../views/ModLogin.vue'
import ModDashboard from '../views/ModDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/mod/login', component: ModLogin },
    {
      path: '/mod',
      component: ModDashboard,
      beforeEnter: () => {
        if (!localStorage.getItem('mod_token')) return '/mod/login'
      },
    },
  ],
})

export default router
