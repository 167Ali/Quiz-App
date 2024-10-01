<template>
  <div class="card mb-4">
    <div class="card-header text-white">Student Requests</div>
    <div class="card-body">
      <div class="table-responsive">
        <div class="table-scrollable">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>CV</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in studentRequests" :key="student.id">
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>
                  <span :class="statusClass(student.status)">{{ student.status }}</span>
                </td>
                <td>
                  <a v-if="student.cvPath" :href="student.cvPath" target="_blank" class="btn btn-info">
                    View CV
                  </a>
                  <span v-else>No CV available</span>
                </td>
                <td>
                  <button class="btn btn-success" @click="acceptRequest(student.id)"
                    :disabled="student.status !== 'pending'">
                    Accept
                  </button>
                  <button class="btn btn-danger" @click="rejectRequest(student.id)"
                    :disabled="student.status !== 'pending'">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      studentRequests: [],
    };
  },
  created() {
    this.fetchStudentRequests();
  },
  methods: {
    async fetchStudentRequests() {
      try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('access_token');

        // Set up the request headers
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
          },
        };

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/view-students`, config);
        console.log('Response data:', response.data); // Log the entire response

        // Check if the response status is successful
        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          this.studentRequests = response.data.data; // Store the requests in the component's state
        } else {
          console.error('Expected an array but received:', response.data);
          // Handle the case where data is not an array
          this.studentRequests = []; // Reset or set to default
        }
      } catch (error) {
        console.error('Error fetching student requests:', error);
      }
    },
    async acceptRequest(id) {
      try {
        console.log('Accepting submission ID:', id);

        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('access_token');

        // Set up the request headers
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
          },
        };

        // Use the new API endpoint with the ID in the URL
        const updateResponse = await axios.patch(`${import.meta.env.VITE_API_URL}/admin/submission/${id}/accept`, null, config);

        // Check if the response indicates success
        if (updateResponse.status !== 200) {
          throw new Error(`Error updating student request status: ${updateResponse.data}`);
        }

        console.log(`Accepted request for submission ID: ${id}`);
        await this.fetchStudentRequests(); // Refresh the list
      } catch (error) {
        console.error('Error accepting student request:', error.message);
      }
    },
    async rejectRequest(id) {
      try {
        // Retrieve the access token from local storage
        const accessToken = localStorage.getItem('access_token');

        // Set up the request headers
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
            'Content-Type': 'application/json',
          },
        };

        // Use the new API endpoint with the ID in the URL
        const updateResponse = await axios.patch(`${import.meta.env.VITE_API_URL}/submission/${id}/reject`, null, config);

        // Check if the response indicates success
        if (updateResponse.status === 200) {
          console.log(`Rejected request for student ID: ${id}`);
          await this.fetchStudentRequests(); // Refresh the list
        } else {
          console.error('Error rejecting request:', updateResponse.status, updateResponse.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    statusClass(status) {
      return {
        'text-danger': status === 'rejected',
        'text-success': status === 'accepted',
        'text-warning': status === 'pending',
      };
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card .card-header {
  background-color: #17a2b8;
}

.table {
  margin-bottom: 0;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: #e9ecef;
}

.status {
  font-weight: bold;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-warning {
  color: #ffc107;
}

.btn {
  margin-right: 5px;
}

/* New styles for scrolling */
.table-scrollable {
  max-height: 300px; /* Set your desired maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
  display: block; /* Make the div a block element to manage scrolling */
}

.table-responsive {
  overflow-x: auto; /* Allow horizontal scrolling if necessary */
}
</style>