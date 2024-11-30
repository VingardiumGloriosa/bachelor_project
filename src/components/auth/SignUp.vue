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
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "vue-router";
import ArrowBack from "../shared/ArrowBack.vue";
import { useAuthStore } from "@/stores/AuthStore";

const email = ref("");
const loading = ref(false);
const router = useRouter();

const auth = useAuthStore();

const handleSignup = async () => {
  try {
    await auth.signInWithMagicLink(email.value);
    alert("Check your email for the magic link to log in!");
  } catch (error) {
    console.error("Error during sign-in:", error.message);
  }
};

onMounted(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      const userDetails = session.user;
      await handleUserAfterSignup(userDetails);
    }
  });
});

const handleUserAfterSignup = async (userDetails) => {
  try {
    const { error } = await supabase.from("users").upsert({
      id: userDetails.id,
      email: userDetails.email,
      first_name: "",
      last_name: "",
    });

    if (error) throw error;

    alert("User details saved successfully!");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error saving user details:", error.message);
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
</style>
