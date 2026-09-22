<template>
  <div :class="['auth-wrapper', { 'theme-alt': isAltTheme }]">
    <div class="auth-container">
      <!-- Left Side -->
      <div class="side left-side">
        <div class="content text-center">
          <h1 class="display-6 fw-bold">RareMed Connect</h1>
          <p class="mt-3">Connecting rare disease patients with life-saving medications and specialized suppliers worldwide.</p>
          <router-link to="/about" class="btn btn-danger rounded-pill px-4 mt-3">
            Learn More
          </router-link>
        </div>
      </div>

      <!-- Right Side -->
      <div class="side right-side">
        <div class="form-container">
          <h1 class="fw-bold">Welcome</h1>
          <h2 class="text-danger mb-4">Back</h2>
          
          <!-- Alert Messages -->
          <div v-if="errorMessage" class="alert alert-danger py-2 fs-7 mb-3" role="alert">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleLogin" novalidate>
            <div class="input-group-custom">
              <input 
                type="email" 
                id="email" 
                v-model.trim="email" 
                required 
                autocomplete="email"
                :disabled="isLoading"
              />
              <label for="email">Email Address</label>
            </div>
            
            <div class="input-group-custom password-group">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model.trim="password" 
                required 
                autocomplete="current-password"
                :disabled="isLoading"
              />
              <label for="password">Password</label>
              <button 
                type="button" 
                class="btn-toggle-pass" 
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                {{ showPassword ? '👁️' : '🙈' }}
              </button>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <label class="form-check-label fs-7">
                <input 
                  type="checkbox" 
                  class="form-check-input me-1" 
                  v-model="rememberMe"
                  :disabled="isLoading"
                > Remember me
              </label>
              <router-link to="/forgot-password" class="text-decoration-none text-primary fs-7">
                Forgot Password?
              </router-link>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-100 py-2 fw-bold" 
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="text-center mt-3 fs-7">
            Don't have an account? 
            <router-link to="/signup" class="text-danger fw-bold text-decoration-none">Sign Up</router-link>
          </p>
        </div>
      </div>

      <!-- Toggle Circle -->
      <div class="toggle-circle" @click="toggleTheme">
        <img :src="currentLogo" alt="Logo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import logo1 from '@/assets/images/logo1.png';
import logo2 from '@/assets/images/logo2.png';

const router = useRouter();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isAltTheme = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const currentLogo = computed(() => isAltTheme.value ? logo2 : logo1);

const toggleTheme = () => {
  isAltTheme.value = !isAltTheme.value;
};

const validateEmail = (val) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(val);
};

const handleLogin = async () => {
  errorMessage.value = '';

  if (!email.value || !validateEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  }

  if (!password.value || password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.';
    return;
  }

  isLoading.value = true;

  try {
    const savedUserRaw = localStorage.getItem('registeredUser');
    const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;

    // التأكد من أن الحساب موجود ومطابق للايميل والباسورد
    if (!savedUser || savedUser.email !== email.value || savedUser.password !== password.value) {
      throw new Error('ليس لديك حساب أو البيانات غير صحيحة. يرجى إنشاء حساب أولاً.');
    }

    // تسجيل الجلسة وتخزين البيانات الحالية
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(savedUser));

    await new Promise((resolve) => setTimeout(resolve, 600));

    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import '@/assets/css/auth.css';

.password-group {
  position: relative;
}

.btn-toggle-pass {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.7;
}

.btn-toggle-pass:hover {
  opacity: 1;
}
</style>