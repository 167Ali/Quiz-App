<template>
  <div class="admin-dashboard">
    <nav class="navbar navbar-expand-lg navbar-lightshadow-sm">
      <a class="navbar-brand" href="#">Admin Dashboard</a>
      <div class="ml-auto">
        <button class="btn btn-outline-danger" @click="logout">Logout</button>
      </div>
    </nav>

    <div class="container mt-4">
      <add-manager></add-manager>
      <student-request></student-request>
      <assign-quiz :quizzes="quizzes" :students="acceptedStudents" @assign-quiz="handleAssignQuiz" />
      <filter-students :students="studentRequests" />
      <view-quiz-section></view-quiz-section>
    </div>
  </div>
</template>

<script>
import AssignQuiz from '../components/AssignQuiz.vue';
import FilterStudents from '../components/FilterStudents.vue';
import AddManager from '../components/AddRole.vue';
import StudentRequest from '../components/StudentRequest.vue';
import ViewQuizSection from '../components/ViewQuiz&StudentResults.vue';
import axios from 'axios';
import router from '../router';

export default {
  components: {
    AssignQuiz,
    FilterStudents,
    AddManager,
    StudentRequest,
    ViewQuizSection
  },
  data() {
    return {
      quizzes: [],
      acceptedStudents: [],
      studentRequests: [] // Initialize as empty
    };
  },
  methods: {
    async logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      router.push('/login');
    },
    async handleAssignQuiz({ selectedQuiz, selectedStudents }) {
      await this.$store.dispatch('assignQuiz', {
        selectedQuiz,
        selectedStudents
      });
    },
    async fetchPermissions() {
      try {
        const token = localStorage.getItem('token');
        await axios.get('http://192.168.15.76:8000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    },
    async fetchStudentRequests() {
      try {
        const accessToken = localStorage.getItem('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get('http://192.168.15.76:8000/api/admin/view-students', config);
        if (Array.isArray(response.data.data)) {
          this.studentRequests = response.data.data; // Update with fetched data
        } else {
          console.error('Expected an array but received:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching student requests:', error);
      }
    }
  },
  mounted() {
    this.fetchPermissions();
    this.fetchStudentRequests(); // Fetch student requests on mount
  }
};
</script>

<style scoped>
.admin-dashboard {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
.container {
  padding: 20px;
}
</style>