<template>
  <main class="home-page">
    <section class="hero">
      <div class="container">
        <h2>Twoje finanse w jednym miejscu</h2>
        <p>Zarządzaj swoimi kontami, przelewami i oszczędnościami w prosty sposób.</p>
        <div class="cta-buttons" v-if="!auth.isLoggedIn">
          <router-link to="/login" class="btn">Zaloguj się</router-link>
          <router-link to="/register" class="btn btn-secondary">Zarejestruj się</router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2>Dlaczego Witelon Bank?</h2>
        <div class="feature-list">
          <div class="feature">
            <h3>Szybkie przelewy</h3>
            <p>Wykonuj przelewy w kilka sekund, gdziekolwiek jesteś.</p>
          </div>
          <div class="feature">
            <h3>Bezpieczeństwo</h3>
            <p>Twoje dane są chronione najnowszymi technologiami.</p>
          </div>
          <div class="feature">
            <h3>Wsparcie 24/7</h3>
            <p>Nasza obsługa klienta jest dostępna przez całą dobę.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2>Opinie naszych klientów</h2>
        <div class="testimonial-list">
          <div class="testimonial">
            <p>"Witelon Bank to najlepszy wybór dla moich finansów!"</p>
            <span>- Jan Kowalski</span>
          </div>
          <div class="testimonial">
            <p>"Szybkie przelewy i świetna obsługa klienta."</p>
            <span>- Anna Nowak</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 Witelon Bank. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import {useAuthStore} from "../store/auth.ts";
const auth = useAuthStore();
</script>

<style scoped>
.home-page {
  font-family: 'Segoe UI', sans-serif;
  line-height: 1.6;
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  padding: 4rem 1rem;
  background-color: #071d44;
  text-align: center;
  color: white;
  border-bottom-left-radius: 3rem;
  border-bottom-right-radius: 3rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.hero h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #e0e0e0;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-buttons .btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: #071d44;
  background-color: white;
  border: none;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid white;
}

.cta-buttons .btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-buttons .btn:hover {
  background-color: #e0e7ff;
  color: #071d44;
}

.features {
  padding: 4rem 1rem;
  background-color: #f3f4f6;
  text-align: center;
}

.features h2 {
  color: #071d44;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.feature-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.feature {
  flex: 1 1 300px;
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #071d44;
}

.feature p {
  color: #334155;
}

.testimonials {
  padding: 4rem 1rem;
  background-color: #ffffff;
  text-align: center;
}

.testimonials h2 {
  color: #071d44;
  font-size: 2.5rem;
}

.testimonial-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  margin-top: 2rem;
}

.testimonial {
  max-width: 600px;
  background-color: #f8fafc;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.testimonial p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #334155;
}

.testimonial span {
  font-weight: bold;
  color: #071d44;
}

.footer {
  background-color: #071d44;
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  margin-top: 4rem;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
}
</style>
