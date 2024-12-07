<template>
  <arrow-back @click="close" class="backbtn" />
  <v-container class="general">
    <h1>Sign-up</h1>
    <v-form @submit.prevent="handleSignup">
      <v-text-field
        v-model="email"
        label="Email Address"
        type="email"
        required
        variant="outlined"
        rounded="lg"
      />
      <v-btn
        class="btn-primary"
        :loading="loading"
        :disabled="loading"
        type="submit"
      >
        Continue
      </v-btn>
      <p class="text-center">Already have an account?</p>
      <p class="text-center text-grey" @click="signin">Log In</p>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";
import { useToastStore, ToastType } from "@/stores/ToastStore";

const email = ref("");
const loading = ref(false);
const router = useRouter();
const auth = useAuthStore();
const toastStore = useToastStore();

const handleSignup = async () => {
  try {
    // Request magic link via Supabase
    await auth.signInWithMagicLink(email.value);
    toastStore.toast(
      "Check your email for the magic link to log in!",
      ToastType.SUCCESS
    );
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    toastStore.toast(
      "Failed to send magic link. Please try again.",
      ToastType.ERROR
    );
  }
};

const signin = () => {
  router.push("/signin");
};

function close() {
  router.push("/");
}
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

.v-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.backbtn {
  position: absolute;
  top: 20px;
  left: 20px;
}

.text-center {
  text-align: center;
  cursor: pointer;
}

.v-btn {
  width: 100%;
}
</style>
