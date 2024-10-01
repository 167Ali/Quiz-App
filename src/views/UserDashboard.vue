<template>
  <div class="manager-dashboard">
    <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
      <a class="navbar-brand" href="#">User Dashboard</a>
      <div class="ml-auto">
        <button class="btn btn-outline-danger" @click="logout">Logout</button>
      </div>
    </nav>

    <div class="container mt-4">
      <!-- Assign Quizzes Section -->
      <assign-quiz
        :quizzes="quizzes"
        :students="acceptedStudents"
        @assign-quiz="handleAssignQuiz"
      />

      <!-- Filter Students Section -->
      <filter-students :students="students" />
    </div>
  </div>
</template>

<script>
import AssignQuiz from '../components/AssignQuiz.vue';
import FilterStudents from '../components/FilterStudents.vue';
import axios from 'axios';
import router from '../router';

export default {
  components: {
    AssignQuiz,
    FilterStudents
  },
  data() {
    return {
      quizzes: [
        { id: 1, title: 'Math Quiz' },
        { id: 2, title: 'Science Quiz' },
        { id: 3, title: 'History Quiz' }
      ],
      students: [] // Initialize as empty array
    };
  },
  computed: {
    acceptedStudents() {
      return this.students.filter(student => student.status === 'accepted');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_expires_in');
      localStorage.removeItem('permissions');
      console.log('Token after logout:', localStorage.getItem('token'));
      router.push('/login');
    },
    async fetchStudents() {
      try {
        const accessToken = localStorage.getItem('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get('http://192.168.15.76:8000/api/admin/view-students', config);
        if (Array.isArray(response.data)) {
          this.students = response.data; // Update with fetched data
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching student requests:', error);
      }
    },
    handleAssignQuiz({ selectedQuiz, selectedStudents }) {
      console.log(`Assigned quiz: ${selectedQuiz.title} to students: ${selectedStudents.map(s => s.email).join(', ')}`);
    }
  },
  mounted() {
    this.fetchStudents(); // Fetch students when the component mounts
  }
};
</script>

<style scoped>
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
  background-color: #dc3545; /* Darker red on hover */
  color: white;
}

.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Additional styles as needed */
</style>