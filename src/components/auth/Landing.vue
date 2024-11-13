<template>
  <div class="landing-page">
    <h1>Welcome to the App!</h1>
    <button @click="goToSignUp">Sign Up</button>
    <button @click="goToSignIn">Sign In</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToSignUp = () => {
  router.push("/signup");
};

const goToSignIn = () => {
  router.push("/signin");
};
</script>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
}
</style>
