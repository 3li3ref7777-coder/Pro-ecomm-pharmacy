import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import AboutView from '@/views/AboutView.vue';
import DashboardView from '@/views/DashboardView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'SignUp', component: RegisterView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/about', name: 'About', component: AboutView },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// حارس التنقل لحماية الصفحات المحمية
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/signup') && isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;