<template>
  <div class="card mb-4">
    <div class="card-header">Add User Role</div>
    <div class="card-body">
      <form @submit.prevent="addUserRole">
        <div class="mb-3">
          <label for="userName" class="form-label">User Name</label>
          <input type="text" class="form-control" id="userName" v-model="userName" required
            placeholder="Enter user name" />
        </div>
        <div class="mb-3">
          <label for="userEmail" class="form-label">User Email</label>
          <input type="email" class="form-control" id="userEmail" v-model="userEmail" required
            placeholder="Enter user email" />
        </div>
        <div class="mb-3">
          <label for="userRole" class="form-label">Role</label>
          <select class="form-select" id="userRole" v-model="userRole" required>
            <option value="manager">Manager</option>
            <option value="supervisor">Supervisor</option>
            <option value="team-lead">Team Lead</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Add User Role</button>
      </form>
      <div v-if="message" class="mt-3 alert alert-info">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userName: '',
      userEmail: '',
      userRole: 'manager',
      message: '',
    };
  },
  methods: {
    async addUserRole() {
      const token = localStorage.getItem('access_token'); 
      const payload = {
        name: this.userName,
        email: this.userEmail,
        role: this.userRole,
      };

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/add-user`, payload, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined, 
          },
        });

        this.message = `User added successfully: ${this.userName}`;
        this.resetForm();
      } catch (error) {
        console.error('Error adding user:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          this.message = `Failed to add user: ${JSON.stringify(error.response.data.errors)}`; 
        } else {
          this.message = 'Failed to add user. Please try again.';
        }
      }
    },
    resetForm() {
      this.userName = '';
      this.userEmail = '';
      this.userRole = 'manager';
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #17a2b8;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}

.form-label {
  font-weight: bold;
}

.form-control,
.form-select {
  border-radius: 5px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn {
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-primary:hover {
  background-color: #6edbec;
  transform: scale(1.05);
}

.alert {
  border-radius: 5px;
}

@media (max-width: 576px) {
  .card {
    margin: 10px;
  }
}
</style>