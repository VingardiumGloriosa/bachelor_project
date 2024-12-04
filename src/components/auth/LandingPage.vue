<template>
  <v-container class="general">
    <img :src="Logo" alt="App Logo" class="logo" />
    <h1>Welcome</h1>
    <v-btn class="btn-primary" @click="goToSignIn">Sign In</v-btn>
    <v-btn class="btn-secondary" @click="goToSignUp">Sign Up</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Logo from "@/assets/logo.svg";

const router = useRouter();

const goToSignUp = () => {
  router.push("/signup");
};

const goToSignIn = () => {
  router.push("/signin");
};
</script>

<style scoped>
.general {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 5%;
  gap: 20px;
}

.logo {
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
}
</style>
