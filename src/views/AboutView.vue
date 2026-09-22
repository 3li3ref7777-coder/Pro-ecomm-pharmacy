<template>
  <div class="about-wrapper">
    <div class="about-container">
      <header class="about-glass-card main-header">
        <h1 class="neon-text">RareMed Connect</h1>
        <p>Your secure bridge to scarce and essential medications</p>
      </header>

      <div class="content-grid">
        <section class="about-glass-card">
          <div class="about-icon-box"><i class="fas fa-exclamation-triangle"></i></div>
          <h3>The Challenge</h3>
          <p>Patients and healthcare providers often face an exhausting struggle to locate rare or limited-availability medicines, leading to delayed treatments and immense stress for families.</p>
        </section>

        <section class="about-glass-card">
          <div class="about-icon-box"><i class="fas fa-lightbulb"></i></div>
          <h3>Our Solution</h3>
          <p>We provide a smart digital platform that connects patients directly with pharmacies and suppliers, offering real-time availability updates and streamlined request tracking in one place.</p>
        </section>
      </div>

      <section class="about-glass-card features">
        <h3>Why Choose Us?</h3>
        <div class="features-list">
          <div class="feature-item">
            <i class="fas fa-search-location"></i>
            <span>Real-time search for scarce medicines.</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-truck-loading"></i>
            <span>Direct connection to verified suppliers.</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-bell"></i>
            <span>Instant notifications on stock availability.</span>
          </div>
          <div class="button-container">
            <button @click="goBack" class="btn-neon-link">Visit Website</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/login');
  }
};
</script>

<style scoped>
@import '@/assets/css/about.css';

.btn-neon-link {
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>