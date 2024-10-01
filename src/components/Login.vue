<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Welcome back</h2>
      <p>Please Enter your Account details</p>

      <label class="label-field">Email</label>
      <input 
        v-model="email" 
        type="email" 
        placeholder="Enter your email" 
        required 
        class="input-field" 
      />

      <label class="label-field">Password</label>
      <input 
        v-model="password" 
        type="password" 
        placeholder="Enter your password" 
        required 
        class="input-field" 
      />
        <div class="checkbox-container">
          <input type="checkbox" id="rememberMe" />
          <label for="rememberMe">Remember me</label>
          <router-link to="/set-password" class="forgot-password">Forgot Password?</router-link>
        </div>
      <button type="submit" class="submit-btn">Sign In</button>

      <div class="signup-class">
        <p>Are you a student? <router-link to="/student-signup">Click here to sign up</router-link></p>
      </div>

      <div class="social-login">
        <p>Or continue with</p>
        <div class="social-buttons">
          <button class="google-btn" @click="loginWithGoogle">Google</button>
          <button class="github-btn" @click="loginWithGithub">Github</button>
          <button class="facebook-btn" @click="loginWithFacebook">Facebook</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
  try {
    console.log('Attempting to log in with:', this.email, this.password);
    await this.login({ email: this.email, password: this.password });
    console.log('Login successful!');
  } catch (error) {
    console.error('Login failed:', error); 
    alert('Login failed! ' + (error.message || 'Please check your credentials.')); 
  }
},
    loginWithGoogle() {
      alert('Google Login Coming Soon');
    },
    loginWithGithub() {
      alert('Github Login Coming Soon');
    },
    loginWithFacebook() {
      alert('Facebook Login Coming Soon');
    }
  }
};
</script>

<style scoped>
@media (max-width: 600px) {
  .checkbox-container label {
    margin-right: 80px;
  }
}

@keyframes slide-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(to right, rgba(13, 19, 32, 0.9), rgba(51, 64, 79, 0.7)), 
              url('https://images.unsplash.com/photo-1483982258113-b72862e6cff6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhcmt8ZW58MHx8MHx8fDA%3D');
  background-size: cover;
  background-position: center right;
}

.login-form {
  background-color: #1D263A;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  text-align: center;
  color: white;
  animation: slide-down 1s ease forwards;
}

.signup-class p a {
  color: #4F93E3;
  text-decoration: none; 
}

/* Heading and text styles */
h2 {
  font-size: 26px;
  margin-bottom: 10px;
  font-weight: 700;
  color: white;
}

p {
  margin-bottom: 30px;
  color: #bbb;
  font-size: 14px;
}

/* Input Styles */
.input-field {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #3C4B64;
  font-size: 14px;
  background-color: #2A3449;
  color: white;
  outline: none;
}

.input-field:focus {
  border-color: #4F93E3;
  box-shadow: 0 4px 8px rgba(79, 147, 227, 0.2);
}

.submit-btn {
  width: 100%;
  background: linear-gradient(45deg, #4A9DFF, #5D6CC3);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease, transform 0.3s ease;
  margin-bottom: 5px;
}

.submit-btn:hover {
  background: linear-gradient(45deg, #669EFF, #798BC8);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Social Login Section */
.social-login {
  margin-top: 30px;
}

.social-login p {
  margin-bottom: 15px;
  font-size: 14px;
  color: #bbb;
}

.social-buttons {
  display: flex;
  justify-content: space-between;
}

.google-btn,
.github-btn,
.facebook-btn {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.google-btn {
  background-color: #DB4437;
}

.github-btn {
  background-color: #333;
}

.facebook-btn {
  background-color: #3B5998;
}

.google-btn:hover {
  background-color: #C13525;
  transform: translateY(-3px);
}

.github-btn:hover {
  background-color: #222;
  transform: translateY(-3px);
}

.facebook-btn:hover {
  background-color: #2C4373;
  transform: translateY(-3px);
}

/* Checkbox and Forgot Password Styles */
.checkbox-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #bbb;
}

.checkbox-container label {
  margin-right: auto;
}

.forgot-password {
  color: #4F93E3;
  font-size: 12px;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>