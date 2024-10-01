import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; // Import the Vuex store
import Login from '../components/Login.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import UserDashboard from '../views/UserDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import StudentSignup from '../components/StudentSignup.vue';
import SetPassword from '../components/SetPassword.vue';
import CreateQuiz from '../components/CreateQuiz.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/set-password', name: 'SetPassword', component: SetPassword },
  { path: '/create-quiz', name: 'CreateQuiz', component: CreateQuiz },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    // meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    // meta: { requiresAuth: true, role: 'Manager' }
  },
  {
    path: '/student-signup',
    component: StudentSignup,
  },
  {
    path: '/student-dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard,
    // meta: { requiresAuth: true, role: 'Student' }
  },
  // Catch-all route to redirect to login if the route doesn't match
  { path: '/:pathMatch(.*)*', redirect: '/login' } // Sends unmatched paths to login
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      next('/login');
    } else {
      // Proceed if authenticated
      next();
    }
  } else {
    // Route does not require auth, proceed
    next();
  }
});

export default router;