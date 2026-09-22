<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-lg border-0" style="max-width: 420px; width: 100%; border-radius: 12px;">
      <h2 class="text-center font-monospace fw-bold mb-1">Sign Up TO</h2>
      <h2 class="text-center font-monospace fw-bold mb-4 text-warning">RareMed Connect</h2>

      <div v-if="errorMessage" class="alert alert-danger py-2 fs-7 mb-3">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="mb-2">
          <label class="form-label fw-bold">Email *</label>
          <input type="email" class="form-control" v-model="form.email" required />
        </div>

        <p class="small text-muted my-2">
          Already have an account? 
          <router-link to="/login" class="text-warning text-decoration-none fw-bold">Sign In</router-link>
        </p>

        <div class="row g-2 mb-2">
          <div class="col-6">
            <label class="form-label fw-bold">First Name *</label>
            <input type="text" class="form-control" v-model="form.firstName" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-bold">Last Name *</label>
            <input type="text" class="form-control" v-model="form.lastName" required />
          </div>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold">Password *</label>
          <input type="password" class="form-control" v-model="form.password" required />
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold">Company *</label>
          <input type="text" class="form-control" v-model="form.company" required />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Phone Number *</label>
          <input type="tel" class="form-control" v-model="form.phone" required />
        </div>

        <button type="submit" class="btn btn-warning text-white w-100 fw-bold py-2">Sign Up</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const errorMessage = ref('');

const form = reactive({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  company: '',
  phone: ''
});

const handleRegister = () => {
  if (!form.email || !form.password || !form.firstName || !form.lastName) {
    errorMessage.value = 'الرجاء إدخال كافة البيانات المطلوبة';
    return;
  }

  // حفظ حساب المستخدم المسجل
  const userData = { ...form };
  localStorage.setItem('registeredUser', JSON.stringify(userData));

  alert('تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.');

  // التوجيه إلى صفحة Login
  router.push('/login');
};
</script>