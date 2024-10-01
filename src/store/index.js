import { createStore } from 'vuex';
import axios from 'axios';
import router from '../router';

export default createStore({
  state: {
    user: null,
    token: null,
    isLoggedIn: false,
  },
  mutations: {
    login(state, userData) {
      state.user = userData.user;
      state.token = userData.token;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },

  actions: {
    async login({ commit }, { email, password }) {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/login`;
        const response = await axios.post(apiUrl, { email, password });
        console.log('Login response:', response.data);
    
        const { status, data, token } = response.data;
    
        if (status !== 'success') {
          throw new Error(data.message || 'Login failed.');
        }
    
        const { access_token, token_type } = token;
    
        if (!access_token) {
          throw new Error('Access token is missing');
        }
    
        const roles = data.role || [];
        const userRole = roles[0];
    
        commit('login', {
          role: userRole,
          token: `${token_type} ${access_token}`,
        });
    
        // Store in local storage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user_role', userRole);
        
        // Store student ID in local storage
        localStorage.setItem('student_id', data.studentId); // Store studentId
    
        // Store additional student info if needed
        const studentInfo = {
          id: data.studentId, 
          name: data.name,
          email: email, // Assuming you want to keep the email as well
        };
        localStorage.setItem('student_info', JSON.stringify(studentInfo));
    
        switch (userRole) {
          case 'admin':
            router.push('/admin-dashboard');
            break;
          case 'manager':
          case 'supervisor':
            router.push('/user-dashboard');
            break;
          case 'student':
            router.push('/student-dashboard');
            break;
          default:
            router.push('/');
            break;
        }
      } catch (error) {
        console.error('Error during login:', error);
        throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
      }
    },
    logout({ commit }) {
      commit('logout');
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token; 
    },
    getUser(state) {
      return state.user;
    },
  },
});