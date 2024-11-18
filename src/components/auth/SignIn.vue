<template>
  <arrow-back @click="close" class="backbtn" />
  <v-container class="general">
    <h1>Sign-in</h1>
    <v-form @submit.prevent="handleLogin">
      <p>Email Address</p>
      <v-text-field
        v-model="email"
        label="Email"
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
      <p class="text-grey text-center">Don't have an account?</p>
      <p class="text-center" @click="signup">Create Account</p>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "vue-router";
import ArrowBack from "../shared/ArrowBack.vue";

const email = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signInWithOtp({ email: email.value });
    if (error) throw error;

    alert("Check your email for the magic link to log in!");
  } catch (error) {
    console.error("Error sending magic link:", error.message);
  } finally {
    loading.value = false;
  }
};

function close() {
  router.push("/");
}

const signup = () => {
  router.push("/signup");
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

.v-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.backbtn {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
