<template>
  <div class="assign-quiz">
    <h3 class="mb-4">Assign Quizzes to Accepted Students</h3>
    <form @submit.prevent="assignQuiz">
      <div class="mb-3">
        <label for="quizSelect" class="form-label">Select Quiz</label>
        <select class="form-select" id="quizSelect" v-model="selectedQuiz" required>
          <option value="" disabled>Select a quiz</option>
          <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz">{{ quiz.title }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="studentSelect" class="form-label">Select Accepted Students</label>
        <select multiple class="form-select" id="studentSelect" v-model="selectedStudents" required>
          <option v-for="student in acceptedStudents" :key="student.email" :value="student">{{ student.name }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Assign Quiz</button>
    </form>
    <div v-if="confirmationMessage" class="alert alert-info mt-3">{{ confirmationMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedQuiz: null,
      selectedStudents: [],
      confirmationMessage: '',
      quizzes: [],
      students: [],
      token: localStorage.getItem('access_token'), 
    };
  },
  computed: {
    // Filter to get only accepted students
    acceptedStudents() {
      return this.students.filter(student => student.status === 'accepted'); 
    }
  },
  mounted() {
    this.fetchQuizzes();
    this.fetchStudents();
  },
  methods: {
    async fetchQuizzes() {
      try {
        const response = await axios.get('http://192.168.15.76:8000/api/view-quizzes', {
          headers: {
            Authorization: `Bearer ${this.token}`, 
          },
        });


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
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/view-students`, {
      headers: {
        Authorization: `Bearer ${this.token}`, // Include your token
      },
    });
    

    if (response.data.success === false) {
      alert(response.data.message);
      return;
    }

    // Access the students array from response.data.data
    if (Array.isArray(response.data.data)) {
      this.students = response.data.data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status, // Assuming the status is included in the response
      }));
    } else {
      console.error('Expected an array but got:', response.data.data);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
  }
},
    
    async assignQuiz() {
      if (this.selectedStudents.length === 0) {
        alert("Please select at least one accepted student.");
        return;
      }

      const assignedAt = new Date().toISOString();
      const dueAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Due in 1 day

      try {
        const promises = this.selectedStudents.map(student => {
          return axios.post(`${import.meta.env.VITE_API_URL}/assign-quiz`, {
            quiz_id: this.selectedQuiz.id,
            student_id: student.id,
            assigned_at: assignedAt,
            due_at: dueAt,
            status: 'assigned', // Assuming a default status
          }, {
            headers: {
              Authorization: `Bearer ${this.token}`, // Include your token
            },
          });
        });

        await Promise.all(promises);
        this.confirmationMessage = `Successfully assigned "${this.selectedQuiz.title}" to ${this.selectedStudents.map(s => s.name).join(', ')}.`;
        
        // Clear selections after assignment
        this.selectedQuiz = null;
        this.selectedStudents = [];
      } catch (error) {
        console.error('Error during quiz assignment:', error);
        alert('An error occurred while assigning the quiz.');
      }
    }
  }
};
</script>

<style scoped>
.assign-quiz {
  margin: 20px 0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0.1, 0, 0, 0.1);
  background-color: #f3f5f6;
}

h3 {
  font-weight: bold;
  color: #17a2b8;
}

.form-label {
  font-weight: bold;
}

.form-select {
  border-radius: 5px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s;
}

.form-select:focus {
  box-shadow: 0 0 5px rgba(69, 223, 240, 0.5);
}

.btn {
  border-radius: 5px;
  margin-top: 10px;
  transition: transform 0.2s;
}

.btn-primary {
  background-color: #17a2b8;
}

.btn-primary:hover {
  background-color: #62d2e3;
  transform: scale(1.05);
}

.alert {
  border-radius: 5px;
}

@media (max-width: 576px) {
  .assign-quiz {
    margin: 10px;
    padding: 15px;
  }
}
</style>