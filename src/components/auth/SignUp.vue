<template>
  <div class="form-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignup">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="firstName"
        type="text"
        placeholder="First Name"
        required
      />
      <input v-model="lastName" type="text" placeholder="Last Name" required />

      <select v-model="roleId" required>
        <option v-for="role in roles" :key="role.role_id" :value="role.role_id">
          {{ role.role_name }}
        </option>
      </select>

      <button type="submit" :disabled="loading">Send Magic Link</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "vue-router";

const email = ref("");
const firstName = ref("");
const lastName = ref("");
const roleId = ref(null);
const roles = ref([]);
const loading = ref(false);
const router = useRouter();

const fetchRoles = async () => {
  try {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) throw error;
    roles.value = data;
  } catch (error) {
    console.error("Error fetching roles:", error.message);
  }
};

onMounted(() => {
  fetchRoles();
});

const handleSignup = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signInWithOtp({ email: email.value });
    if (error) throw error;

    sessionStorage.setItem(
      "userDetails",
      JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        roleId: roleId.value,
      })
    );

    alert("Check your email for a magic link to complete sign-up!");
  } catch (error) {
    console.error("Error sending magic link:", error.message);
  } finally {
    loading.value = false;
  }
};
</script>
