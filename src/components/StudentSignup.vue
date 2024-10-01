<template>
    <div class="signup-container">
        <form @submit.prevent="submitSignup" class="signup-form">
            <h2>Student Signup</h2>
            <p>Please enter your details</p>

            <label class="label-field">Name</label>
            <input v-model="studentName" type="text" placeholder="Enter your name" required class="input-field" />

            <label class="label-field">Email</label>
            <input v-model="studentEmail" type="email" placeholder="Enter your email" required class="input-field" />

            <label class="label-field">Upload CV</label>
            <input type="file" @change="handleFileUpload" required class="input-field" />

            <button type="submit" class="submit-btn">Sign Up</button>

            <div class="signup-class">
                <p>Already have an account? <router-link to="/login">Click here to log in</router-link></p>
            </div>
            <div class="social-login">
                <p>Or continue with</p>
                <div class="social-buttons">
                    <button class="google-btn" @click="signUpWithGoogle">Google</button>
                </div>
            </div>
        </form>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            studentName: '',
            studentEmail: '',
            cv_file: null,
        };
    },
    methods: {
        async submitSignup() {
            const formData = new FormData();
            formData.append('name', this.studentName);
            formData.append('email', this.studentEmail);
            formData.append('cv_file', this.cv_file); 
            console.log(this.cv_file);

            try {
                const response = await fetch('http://192.168.15.76:8000/api/submission', {
                    method: 'POST',
                    body: formData, 
                });

                if (response.ok) {
                    console.log('Signup request submitted successfully');
                    this.$router.push('/login'); // Redirect to login page
                } else {
                    console.error('Error submitting signup request');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        handleFileUpload(event) {
            this.cv_file = event.target.files[0];
        },
        signUpWithGoogle() {
            alert('Google Sign Up Coming Soon!');
        }
    },
};
</script>
  
<style scoped>
.signup-container {
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

.signup-form {
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

.signup-class p a {
    color: #4F93E3;
    text-decoration: none;
}

.google-btn {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background-color: #DB4437;
    color: white;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
}

.google-btn:hover {
    background-color: #C13525;
    transform: translateY(-3px);
}

.social-login {
    margin-top: -25px;
}

.social-buttons {
    margin-top: -15px;
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
</style>