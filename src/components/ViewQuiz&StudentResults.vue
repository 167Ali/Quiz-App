<template>
  <div class="card mb-4 shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center text-black">
      <h5 class="mb-0">View Quizzes</h5>
      <button class="btn btn-outline-dark" @click="createQuiz">Create Quiz</button>
    </div>
    <div class="card-body">
      <div class="scrollable-quizzes">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quiz in quizzes" :key="quiz.id">
              <td>{{ quiz.title }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-info" @click="viewStudents(quiz)">View Students</button>
                  <button class="btn btn-success" @click="viewResults(quiz)">View Results</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="quizzes.length === 0" class="text-center text-muted">
          No quizzes available.
        </div>
      </div>
    </div>

    <!-- Students Modal (same as before) -->
    <div v-if="showStudentsModal" class="modal-overlay" @click.self="closeStudentsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Students for {{ selectedQuiz.title }}</h5>
          <button type="button" class="close" @click="closeStudentsModal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body scrollable-modal">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.email">
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.status }}</td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="3" class="text-center text-muted">No students found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeStudentsModal">Close</button>
        </div>
      </div>
    </div>

    <!-- Results Modal (same as before) -->
    <div v-if="showResultsModal" class="modal-overlay" @click.self="closeResultsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Results for {{ selectedQuiz.title }}</h5>
          <button type="button" class="close" @click="closeResultsModal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body scrollable-modal">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in dummyResults" :key="result.studentEmail">
                <td>{{ result.studentName }}</td>
                <td>{{ result.score }}</td>
              </tr>
              <tr v-if="dummyResults.length === 0">
                <td colspan="2" class="text-center text-muted">No results found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeResultsModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from '../router';
import axios from 'axios';

export default {
  data() {
    return {
      quizzes: [],
      students: [], // Initialize students array
      showStudentsModal: false,
      showResultsModal: false,
      selectedQuiz: {},
      dummyResults: [
        { studentName: 'Alice Johnson', studentEmail: 'alice@example.com', score: 85 },
        { studentName: 'Bob Smith', studentEmail: 'bob@example.com', score: 90 },
        { studentName: 'Charlie Brown', studentEmail: 'charlie@example.com', score: 75 }
      ]
    };
  },
  created() {
    this.fetchQuizzes(); // Fetch quizzes when the component is created
    this.fetchStudents(); // Fetch students when the component is created
  },
  methods: {
    async fetchQuizzes() {
      const token = localStorage.getItem('access_token'); // Get token from local storage
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/view-quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include your token
          },
        });
        console.log('Quizzes response:', response.data); // Log the response

        if (response.data.success === false) {
          alert(response.data.message);
          return;
        }

        if (Array.isArray(response.data)) {
          this.quizzes = response.data.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
          }));
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },
    
    async fetchStudents() {
      const token = localStorage.getItem('access_token'); // Get token from local storage
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/view-students`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include your token
          },
        });
        console.log('Students response:', response.data); // Log the response

        if (response.data.success === false) {
          alert(response.data.message);
          return;
        }

        if (Array.isArray(response.data)) {
          this.students = response.data.map(student => ({
            id: student.id,
            name: student.name,
            email: student.email,
            status: student.status, // Assuming the status is included in the response
          }));
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    
    createQuiz() {
      router.push('/create-quiz');
    },
    
    viewStudents(quiz) {
      this.selectedQuiz = quiz;
      this.showStudentsModal = true; // Open the students modal
    },
    
    closeStudentsModal() {
      this.showStudentsModal = false; // Close the students modal
    },
    
    viewResults(quiz) {
      this.selectedQuiz = quiz;
      this.showResultsModal = true; // Open the results modal
    },
    
    closeResultsModal() {
      this.showResultsModal = false; // Close the results modal
    }
  },
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
  background-color: #f3f5f6;
}

.card-header {
  background-color: #b6eaf2; /* Bootstrap primary color */
  color: white;
}

.table {
  margin-top: 20px;
}

.table th {
  background-color: #f8f9fa;
  color: #333;
}

.table td {
  vertical-align: middle;
}

.btn-group {
  display: flex;
  gap: 10px; /* Space between buttons */
}

.btn-info, .btn-success {
  transition: background-color 0.3s, transform 0.2s;
}

.btn-info:hover {
  background-color: #138496; /* Darker shade on hover */
  transform: scale(1.05);
}

.btn-success:hover {
  background-color: #218838; /* Darker shade on hover */
  transform: scale(1.05);
}

.text-muted {
  margin-top: 20px;
  color: #6c757d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 20px;
  width: 100%;
  max-width: 600px; /* Restrict modal width */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-header {
  background-color: #b6eaf2;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
}
.scrollable-quizzes {
  max-height: 300px; /* Set your desired maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
}

.modal-body.scrollable-modal {
  max-height: 400px; /* Set your desired maximum height for modals */
  overflow-y: auto; /* Enable vertical scrolling */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>