<template>
  <div class="forgot-pass-wrapper">
    <div class="glass-card">
      <div class="icon-box">
        <i class="lock-icon">🔒</i>
      </div>
      <h2>Forgot Password?</h2>
      <p>No worries! Enter your registered email below and we will send you a link to reset your password.</p>
      
      <!-- Feedback Alerts -->
      <div v-if="errorMessage" class="alert-box error">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert-box success">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleResetPassword" novalidate>
        <div class="forgot-input-group">
          <input 
            type="email" 
            v-model.trim="email" 
            placeholder="Enter your email" 
            required 
            autocomplete="email"
            :disabled="isLoading"
          />
        </div>
        <button type="submit" class="neon-btn" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div class="footer-links">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const validateEmail = (val) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(val);
};

const handleResetPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!email.value || !validateEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  }

  isLoading.value = true;

  try {
    // Here connect with Firebase Auth or your Backend API:
    // await sendPasswordResetEmail(auth, email.value);

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Security best practice: Avoid revealing whether the email exists or not explicitly
    successMessage.value = `If an account with ${email.value} exists, a reset link has been sent.`;
    email.value = '';
  } catch (error) {
    errorMessage.value = 'Failed to send reset link. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import '@/assets/css/forgot-pass.css';

.alert-box {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 15px;
  text-align: center;
}

.alert-box.error {
  background-color: rgba(255, 0, 0, 0.15);
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
}

.alert-box.success {
  background-color: rgba(0, 255, 128, 0.15);
  color: #00ff80;
  border: 1px solid #00ff80;
}
</style>