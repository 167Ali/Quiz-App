<template>
  <div class="filter-students mb-3">
    <label class="form-label">Filter by Status</label>
    <select class="form-select" v-model="filterStatus" @change="filterStudents">
      <option value="all">All</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
    <div class="table-responsive mt-3">
      <div class="table-scrollable">
        <table class="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Assigned Quizzes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.email">
              <td>{{ student.email }}</td>
              <td>
                <span :class="statusClass(student.status)">{{ student.status }}</span>
              </td>
              <td>
                <ul>
                  <li v-for="quiz in student.quizzes" :key="quiz.id">{{ quiz.title }}</li>
                </ul>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="3" class="text-center text-muted">No students found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    students: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      filterStatus: 'all',
      filteredStudents: []
    };
  },
  watch: {
    students: {
      immediate: true,
      handler() {
        this.initializeStudents();
      }
    },
    filterStatus() {
      this.filterStudents();
    }
  },
  mounted() {
    this.fetchStudentRequests(); 
  },
  methods: {
    async fetchStudentRequests() {
      try {
        const accessToken = localStorage.getItem('access_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/view-students`, config);

        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          this.filteredStudents = response.data.data;
          this.filterStudents();
        } else {
          console.error('Unexpected response structure:', response.data);
          this.filteredStudents = []; 
        }
      } catch (error) {
        console.error('Error fetching student requests:', error);
        this.filteredStudents = []; 
      }
    },
    initializeStudents() {

      this.filteredStudents = this.students.length > 0 ? this.students : [];
      this.filterStudents();
    },
    filterStudents() {
      if (this.filterStatus === 'accepted') {
        this.filteredStudents = this.students.filter(s => s.status === 'accepted');
      } else if (this.filterStatus === 'rejected') {
        this.filteredStudents = this.students.filter(s => s.status === 'rejected');
      } else {
        this.filteredStudents = this.students;
      }
    },
    statusClass(status) {
      return {
        'text-success': status === 'accepted',
        'text-danger': status === 'rejected',
        'text-warning': status === 'pending',
      };
    }
  }
};
</script>

<style scoped>
.filter-students {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0.25, 0, 0, 0.25);
  background-color: #f3f5f6;
}

.form-label {
  font-weight: bold;
}

.table {
  margin-top: 20px;
  width: 100%; /* Ensure the table uses full width */
}

.table th {
  background-color: #17a2b8;
  color: white;
}

.table td {
  vertical-align: middle;
}

.text-success {
  color: #28a745; /* Green for accepted */
}

.text-danger {
  color: #dc3545; /* Red for rejected */
}

.text-warning {
  color: #ffc107; /* Yellow for pending */
}

.table-scrollable {
  max-height: 300px; /* Set your desired maximum height for vertical scrolling */
  overflow-y: auto; /* Enable vertical scrolling */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  display: block; /* Ensure the div behaves like a block element */
}

.table-scrollable table {
  width: 100%; /* Ensure the table takes the full width */
}

@media (max-width: 576px) {
  .filter-students {
    margin: 10px;
    padding: 15px;
  }
}
</style>