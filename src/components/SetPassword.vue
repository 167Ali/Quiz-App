<template>
    <div class="container">
      <div class="card mb-4">
        <div class="card-header text-center">Set Password</div>
        <div class="card-body">
          <form @submit.prevent="setPassword">
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                required
                placeholder="Enter password"
              />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                placeholder="Confirm password"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Set Password</button>
          </form>
          <div v-if="message" class="mt-3 alert alert-info text-center">{{ message }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        password: '',
        confirmPassword: '',
        message: '',
        fixedToken: 'YOUR_FIXED_TOKEN_HERE', 
      };
    },
    methods: {
      async setPassword() {
        if (this.password !== this.confirmPassword) {
          this.message = 'Passwords do not match.';
          return;
        }
  
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}admin/set-password`, {
            password: this.password,
          }, {
            headers: {
              Authorization: `Bearer ${this.fixedToken}`, 
            },
          });
  
          this.message = 'Password set successfully!';
          this.resetForm();
        } catch (error) {
          console.error('Error setting password:', error);
          this.message = 'Failed to set password. Please try again.';
        }
      },
      resetForm() {
        this.password = '';
        this.confirmPassword = '';
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full viewport height */
  }
  
  .card {
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    max-width: 400px; /* Set a max width for the card */
    width: 100%; /* Full width for small screens */
  }
  
  .card-header {
    background-color: #17a2b8;
    color: white;
    font-weight: bold;
    border-radius: 15px 15px 0 0;
    padding: 15px 0; /* Add vertical padding */
  }
  
  .form-label {
    font-weight: bold;
  }
  
  .form-control {
    border-radius: 5px;
    border: 1px solid #ced4da;
    transition: border-color 0.3s;
  }
  
  .form-control:focus {
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