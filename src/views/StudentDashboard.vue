<template>
  <div class="student-dashboard">
      <nav class="navbar navbar-expand-lg navbar-lightshadow-sm">
        <a class="navbar-brand" href="#">Student Dashboard</a>
        <div class="ml-auto">
          <button class="btn btn-outline-danger" @click="logout">Logout</button>
        </div>
      </nav>

      <div class="row">
        <div class="col-md-12">
          <quiz-dashboard />
        </div>
      </div>
  </div>
</template>

<script>
import QuizDashboard from '../components/QuizSection.vue';
import router from '../router';

export default {
  components: {
    QuizDashboard,
  },
  methods: {
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('token_expires_in');
      localStorage.removeItem('permissions');
      console.log('Token after logout:', localStorage.getItem('token'));
      router.push('/login');
    }}
};
</script>

<style scoped>


h1 {
  color: #343a40; /* Darker text color for headers */
}

.quiz-dashboard {
  background-color: #ffffff; /* White background for the quiz section */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  padding: 20px; /* Padding inside the quiz dashboard */
}
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  background-color: #ddeff3;
}

.navbar-brand {
  margin-left: 40%;
  font-size: 30px;
  font-weight: bold;
}

.btn-outline-danger {
  transition: background-color 0.3s, color 0.3s;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

</style>