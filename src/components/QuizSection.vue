<template>
    <div class="quiz-dashboard">
        <h2 class="text-center mb-4">Quizzes</h2>
        <div class="card mb-4">
            <div class="card-header"><strong class="text-white">Assigned Quizzes</strong></div>
            <div class="card-body">
                <ul class="list-group">
                    <li v-for="quiz in assignedQuizzes" :key="quiz.id"
                        class="list-group-item d-flex justify-content-between align-items-center">
                        {{ quiz.title }}
                        <div>
                            <button class="btn btn-success" @click="openModal(quiz)">Start Quiz</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header"><strong class="text-white">Attempted Quizzes</strong></div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6" v-for="quiz in attemptedQuizzes" :key="quiz.id">
                        <div class="quiz-card border rounded p-3 mb-3">
                            <h4>{{ quiz.title }}</h4>
                            <p>Score: {{ quiz.score }}%</p>
                            <button class="btn btn-secondary" disabled>View Results</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header"><strong class="text-white">Pending Quizzes</strong></div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6" v-for="quiz in pendingQuizzes" :key="quiz.id">
                        <div class="quiz-card border rounded p-3 mb-3">
                            <h4>{{ quiz.title }}</h4>
                            <p>Available From: {{ quiz.startDate }}</p>
                            <p>Due Date: {{ quiz.dueDate }}</p>
                            <button class="btn btn-warning">Notify Me</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal for Quiz -->
        <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h3 class="modal-title">{{ quizResults ? 'Quiz Results' : currentQuiz.title }}</h3>
                
                <!-- Display the question text below the title -->
                <div v-if="!quizResults">
                    <p v-for="(question, index) in currentQuiz.questions" :key="question.id">
                        <strong>Question {{ index + 1 }}:</strong> {{ question.question_text }}
                    </p>
                </div>

                <div v-if="quizResults">
                    <p>Your score: <strong>{{ score }} / {{ totalQuestions }}</strong></p>
                    <button class="btn btn-primary" @click="closeModal">Close</button>
                </div>
                
                <div v-else>
                    <form @submit.prevent="submitQuiz">
                        <div v-for="question in currentQuiz.questions" :key="question.id" class="mb-3">
                            <label class="form-label">{{ question.question_text }}</label>
                            <select v-model="answers[question.id]" class="form-select">
                                <option disabled value="">Select an option</option>
                                <option v-for="option in question.options" :key="option" :value="option">{{ option }}</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit Quiz</button>
                    </form>
                </div>
            </div>
        </div>

        <transition name="move">
            <div v-if="isRecording" class="video-container" :class="{ 'move-to-corner': quizInProgress }">
                <video ref="video" autoplay muted class="video-feed"></video>
            </div>
        </transition>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            assignedQuizzes: [],
            quizInProgress: false,
            currentQuiz: null,
            answers: {},
            quizResults: false,
            score: 0,
            totalQuestions: 0,
            isRecording: false,
            mediaRecorder: null,
            recordedChunks: [],
            mediaStream: null,
            attemptedQuizzes: [
                { id: 3, title: 'History Quiz', score: 85 },
                { id: 4, title: 'Geography Quiz', score: 90 },
            ],
            pendingQuizzes: [
                { id: 5, title: 'Literature Quiz', startDate: '2024-10-01', dueDate: '2024-10-10' },
                { id: 6, title: 'Physics Quiz', startDate: '2024-10-03', dueDate: '2024-10-12' },
            ],
            isModalVisible: false,
        };
    },
    methods: {
       
        openModal(quiz) {
            // Find the specific quiz from the assigned quizzes
            const quizData = this.assignedQuizzes.find(q => q.id === quiz.id);

            if (quizData) {

                // Set the currentQuiz with the found quiz data
                this.currentQuiz = {
                    id: quizData.id,
                    title: quizData.title,
                    questions: quizData.questions.map(question => ({
                        id: question.id,
                        question_text: question.question_text,
                        options: JSON.parse(question.options), // Parse options from string to array
                        correctAnswer: question.correct_option,
                    }))
                };

                this.quizInProgress = true;
                this.answers = {};
                this.score = 0;
                this.quizResults = false;
                this.totalQuestions = this.currentQuiz.questions.length;
                this.isModalVisible = true; // Show the modal

                // Start recording if needed
                this.$nextTick(() => {
                    this.startRecording();
                    this.isRecording = true;
                });
            } else {
                console.error('Quiz not found');
            }
        },
        closeModal() {
            this.isModalVisible = false; // Hide the modal
            this.currentQuiz = null; // Clear the current quiz
            this.quizInProgress = false; // Reset progress
        },
        async submitQuiz() {
            this.score = 0;

            // Calculate the score based on the answers
            this.currentQuiz.questions.forEach(question => {
                if (this.answers[question.id] === question.correctAnswer) {
                    this.score++;
                }
            });

            // Stop the recording and get the video blob
            const videoBlob = await this.stopRecordingAndGetBlob();
            if (videoBlob) {
                const base64Video = await this.convertBlobToBase64(videoBlob);
                this.saveToLocalStorage(base64Video);
            }

            // Set quiz results and reset quiz progress
            this.quizResults = true; // Show results
            this.totalQuestions = this.currentQuiz.questions.length; // Set total questions for display
        },
        async startRecording() {
            try {
                this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                this.$nextTick(() => {
                    const videoElement = this.$refs.video;
                    if (videoElement) {
                        videoElement.srcObject = this.mediaStream;
                        videoElement.play();
                    }
                });

                this.mediaRecorder = new MediaRecorder(this.mediaStream);
                this.mediaRecorder.ondataavailable = (event) => {
                    this.recordedChunks.push(event.data);
                };
                this.mediaRecorder.start();
                this.isRecording = true;
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        },
        stopMediaStream() {
            if (this.mediaStream) {
                const tracks = this.mediaStream.getTracks();
                tracks.forEach(track => track.stop());
                this.mediaStream = null; // Clear the mediaStream reference
            }
        },
        async stopRecordingAndGetBlob() {
            return new Promise((resolve) => {
                if (this.mediaRecorder) {
                    this.mediaRecorder.onstop = () => {
                        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                        this.recordedChunks = [];
                        this.stopMediaStream();
                        resolve(blob);
                    };
                    this.mediaRecorder.stop();
                    this.isRecording = false;
                } else {
                    resolve(null);
                }
            });
        },
        async convertBlobToBase64(blob) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });
        },
        saveToLocalStorage(videoData) {
            try {
                const existingData = JSON.parse(localStorage.getItem('quizVideos')) || [];
                existingData.push({
                    quizId: this.currentQuiz.id,
                    video: videoData,
                    score: this.score,
                });

                // Check storage quota and clear old data if necessary
                if (this.isQuotaExceeded(existingData)) {
                    this.clearOldData(existingData);
                }

                localStorage.setItem('quizVideos', JSON.stringify(existingData));
                console.log('Video saved to local storage');
            } catch (error) {
                console.error('Error saving to local storage:', error);
            }
        },
        isQuotaExceeded(dataArray) {
            // Check if the estimated size exceeds localStorage limits
            const estimatedSize = new Blob([JSON.stringify(dataArray)]).size;
            return estimatedSize > 5 * 1024 * 1024; // 5MB limit
        },
        clearOldData(existingData) {
            // Remove the oldest entries until we are under quota
            while (this.isQuotaExceeded(existingData)) {
                existingData.shift(); // Remove the oldest entry
            }
            localStorage.setItem('quizVideos', JSON.stringify(existingData));
        },
        fetchQuizzes() {
            const token = localStorage.getItem('access_token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const studentId = localStorage.getItem('student_id'); // Get student ID from local storage

            // Fetch assigned quizzes for the logged-in student
            axios.get(`${import.meta.env.VITE_API_URL}/view-assigned-quizzes`, { headers })
                .then(assignmentResponse => {
                    const assignments = Array.isArray(assignmentResponse.data) ? assignmentResponse.data : assignmentResponse.data.data;

                    if (Array.isArray(assignments)) {
                        // Filter assignments for the logged-in student
                        const studentAssignments = assignments.filter(assignment => assignment.student_id === parseInt(studentId));
                        const quizIds = studentAssignments.map(assignment => assignment.quiz_id);

                        // Fetch all quizzes
                        return axios.get(`${import.meta.env.VITE_API_URL}/view-quizzes`, { headers })
                            .then(quizResponse => {
                                const allQuizzes = quizResponse.data; // Store all quizzes

                                // Filter quizzes to get only those assigned to the student
                                this.assignedQuizzes = allQuizzes.filter(quiz => quizIds.includes(quiz.id));
                                console.log('Assigned Quizzes:', this.assignedQuizzes);
                            });
                    } else {
                        throw new Error('Expected an array of assignments but got: ' + JSON.stringify(assignments));
                    }
                })
                .catch(error => {
                    console.error('Error fetching quizzes or assignments:', error);
                });
        }
    },
    mounted() {
        this.fetchQuizzes();
    }
};
</script>
<style scoped>
.quiz-dashboard {
    margin-top: 20px;
    background-color: #f3f5f6;
}

.card-header {
    background-color: #17a2b8;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}

.video-container {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 200px;
    height: 150px;
    border: 1px solid black;
    border-radius: 5px;
    overflow: hidden;
    transition: transform 0.5s ease;
}

.video-feed {
    width: 100%;
    height: 100%;
}

.move-enter-active,
.move-leave-active {
    transition: transform 0.5s ease;
}

.move-enter,
.move-leave-to {
    transform: translateY(-20px);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    /* Ensure modal is on top */
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
}

.modal-title {
    margin-bottom: 20px;
    color: #333;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}

.form-label {
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
    