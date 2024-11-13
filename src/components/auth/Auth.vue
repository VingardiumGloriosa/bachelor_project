<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/supabase";

const loading = ref(false);
const email = ref("");
const firstName = ref("");
const lastName = ref("");
const roleId = ref(null);
const roles = ref([]);
const isSignup = ref(false); // To toggle between login/signup forms

// Fetch roles for signup
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

onMounted(() => {
  // Handle user session after login/signup
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

      if (userDetails) {
        await insertUserProfile(
          session.user,
          userDetails.firstName,
          userDetails.lastName,
          userDetails.roleId
        );

        sessionStorage.removeItem("userDetails");
      }
    }
  });
});

// Handle magic link signup for new users
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

// Handle login with email OTP
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

// Insert new user profile with additional details
async function insertUserProfile(user, firstName, lastName, roleId) {
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingProfile) {
      console.log("User profile already exists:", existingProfile);
      return;
    }

    const { error: profileError } = await supabase.from("users").insert([
      {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
      },
    ]);

    if (profileError) throw profileError;

    if (roleId) {
      const { error: roleError } = await supabase
        .from("userroles")
        .insert([{ user_id: user.id, role_id: roleId }]);

      if (roleError) throw roleError;
    }

    alert("Account created and role assigned successfully!");
  } catch (error) {
    console.error("Error creating profile:", error.message);
  }
}
</script>

<template>
  <div v-if="isSignup">
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

  <div v-else>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <button type="submit" :disabled="loading">Send Magic Link</button>
    </form>
  </div>

  <button @click="isSignup = !isSignup">
    {{
      isSignup ? "Already have an account? Login" : "Need an account? Sign Up"
    }}
  </button>
</template>
