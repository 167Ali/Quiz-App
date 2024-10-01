<template>
  <div class="create-quiz-container mt-3">
    <h2 class="title">Create a New Quiz</h2>
    <form @submit.prevent="submitQuiz">
      <div class="form-group">
        <label for="quizTitle">Quiz Title</label>
        <input type="text" id="quizTitle" v-model="quizTitle" class="form-control" placeholder="Enter quiz title"
          required />
        <button type="button" @click="addQuiz" class="btn btn-outline-secondary add-quiz-btn">
          Add Quiz
        </button>
      </div>

      <div v-for="(question, index) in questions" :key="index" class="question-block">
        <div class="question-header">
          <h5 class="question-title">Question {{ index + 1 }}</h5>
          <button type="button" @click="removeQuestion(index)" class="btn btn-danger remove-question-btn">
            Remove
          </button>
        </div>

        <div class="form-group">
          <label for="questionText">Question Text</label>
          <input type="text" :value="question.text" @input="updateQuestionText(index, $event.target.value)"
            class="form-control" placeholder="Enter question text" required />
        </div>

        <div class="form-group">
          <label>Options</label>
          <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-input">
            <input type="text" :value="option" @input="updateQuestionOption(index, optIndex, $event.target.value)"
              class="form-control" placeholder="Enter option" required />
          </div>
        </div>

        <div class="form-group">
          <label for="correctAnswer">Correct Answer</label>
          <input type="text" :value="question.answer" @input="updateCorrectAnswer(index, $event.target.value)"
            class="form-control" placeholder="Enter correct answer" required />
        </div>
      </div>

      <button type="button" @click="addQuestion" class="btn btn-outline-secondary add-question-btn">
        Add Question
      </button>
      <button type="submit" class="btn btn-primary submit-btn">Submit Quiz</button>
    </form>

    <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      quizTitle: '',
      description: 'This is a basic math quiz.',
      scheduledAt: '2024-10-01 10:00:00',
      expiresAt: '2024-10-10 10:00:00',
      questions: [
        {
          text: '',
          options: ['', '', '', ''],
          answer: '',
        },
      ],
      quizId: null,
      message: '',
      errorMessage: '',
      token: localStorage.getItem('access_token'),
    };
  },
  methods: {
    async addQuiz() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-quiz`, {
          title: this.quizTitle,
          description: this.description,
          scheduled_at: this.scheduledAt,
          expires_at: this.expiresAt,
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (response.data && response.data.quiz && response.data.quiz.id) {
          this.quizId = response.data.quiz.id;
          this.message = response.data.message;
          this.errorMessage = '';
          this.resetQuestions();
        } else {
          throw new Error('Quiz ID not found in response');
        }
      } catch (error) {
        console.error('Error creating quiz:', error);
        this.errorMessage = error.response?.data?.message || 'Failed to create quiz.';
        this.message = '';
      }
    },
    resetQuestions() {
      this.questions = [
        {
          text: '',
          options: ['', '', '', ''],
          answer: '',
        },
      ];
    },
    addQuestion() {
      this.questions.push({
        text: '',
        options: ['', '', '', ''],
        answer: '',
      });
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    updateQuestionText(index, value) {
      this.questions[index].text = value;
    },
    updateQuestionOption(questionIndex, optionIndex, value) {
      this.questions[questionIndex].options[optionIndex] = value;
    },
    updateCorrectAnswer(index, value) {
      this.questions[index].answer = value;
    },
    async submitQuiz() {
      if (!this.quizId) {
        this.errorMessage = 'Quiz ID is not set. Please create the quiz first.';
        return;
      }

      try {
        const questionsPromises = this.questions.map((question, index) => {
          // Log the current question
          console.log('Submitting question:', question);

          // Trim values
          question.text = question.text.trim();
          question.options = question.options.map(option => option.trim());
          question.answer = question.answer.trim();

          const payload = {
            quiz_id: this.quizId,
            question_text: question.text,
            options: question.options,
            correct_option: question.answer,
          };

          // Validate each condition
          if (!question.text) {
            console.error(`Question text is missing for question ${index + 1}`);
            throw new Error(`Invalid data for question ${index + 1}. Please ensure all fields are filled correctly.`);
          }
          if (question.options.length !== 4) {
            console.error(`Question ${index + 1} has ${question.options.length} options. Expected 4.`);
            throw new Error(`Invalid data for question ${index + 1}. Please ensure all fields are filled correctly.`);
          }
          if (question.options.some(option => !option)) {
            console.error(`Question ${index + 1} has empty options.`);
            throw new Error(`Invalid data for question ${index + 1}. Please ensure all fields are filled correctly.`);
          }
          if (!question.answer) {
            console.error(`No correct answer provided for question ${index + 1}`);
            throw new Error(`Invalid data for question ${index + 1}. Please ensure all fields are filled correctly.`);
          }
          if (!question.options.includes(question.answer)) {
            console.error(`Correct answer for question ${index + 1} is not in the list of options.`);
            throw new Error(`Invalid data for question ${index + 1}. Please ensure all fields are filled correctly.`);
          }

          return axios.post(`${import.meta.env.VITE_API_URL}/create-questions`, payload, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
        });

        await Promise.all(questionsPromises);

        this.message = 'Quiz and questions created successfully!';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        console.error('Error during question submission:', error);
        this.errorMessage = error.response?.data?.message || error.message || 'An error occurred while submitting questions.';
        this.message = '';
      }
    },
    resetForm() {
      this.quizTitle = '';
      this.quizId = null;
      this.resetQuestions();
    },
  },
};
</script>

<style scoped>
.create-quiz-container {
  max-width: 650px;
  margin: auto;
  padding: 30px;
  background-color: #dce2e2;
  border-radius: 0.75rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);

}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.question-block {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  background-color: #f9f9f9;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-title {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.option-input {
  margin-top: 10px;
}

.btn {
  margin-top: 10px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-outline-secondary {
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: #fff;
}

.btn-danger {
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 0.5rem;
}

.remove-question-btn {
  margin-left: 20px;
}

.add-question-btn,
.submit-btn {
  margin-right: 10px;
}

.alert {
  margin-top: 15px;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
  