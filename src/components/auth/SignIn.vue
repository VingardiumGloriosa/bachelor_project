<template>
  <div class="form-container">
    <h2>Sign In</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit" :disabled="loading">Send Magic Link</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "vue-router";

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
</script>
