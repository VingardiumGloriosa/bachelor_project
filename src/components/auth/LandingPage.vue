<template>
  <v-container class="general">
    <img :src="Logo" alt="App Logo" class="logo" />
    <h1>Welcome</h1>
    <v-btn class="btn-primary" @click="goToSignIn">Sign In</v-btn>
    <v-btn class="btn-secondary" @click="loginAsDemo"
      >Log in as Demo User</v-btn
    >
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";
import { useToastStore, ToastType } from "@/stores/ToastStore";
import Logo from "@/assets/logo.svg";

const router = useRouter();
const auth = useAuthStore();
const toastStore = useToastStore();

const goToSignIn = () => {
  router.push("/signin");
};

const loginAsDemo = async () => {
  try {
    await auth.loginAsDemo();
    toastStore.toast("Logged in as demo user!", ToastType.SUCCESS);
    router.push("/home");
  } catch (error) {
    toastStore.toast("Failed to log in as demo user.", ToastType.ERROR);
  }
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

.v-btn {
  width: 100%;
}
</style>
