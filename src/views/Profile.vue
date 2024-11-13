<template>
  <div class="home-container">
    <p>This is the profile page</p>
    <form v-if="!loading" @submit.prevent="updateProfile">
      <div>
        <label>Email</label>
        <input type="text" :value="email" disabled />
      </div>
      <div>
        <label>First Name</label>
        <input v-model="firstName" required />
      </div>
      <div>
        <label>Last Name</label>
        <input v-model="lastName" required />
      </div>
      <div>
        <label>Role</label>
        <input type="text" :value="roleName" disabled />
      </div>
      <button type="submit" :disabled="loading">Update Profile</button>
      <button @click="signOut" :disabled="loading">Sign Out</button>
    </form>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { supabase } from "@/supabase/supabase";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(true);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const roleName = ref("");

onMounted(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return;
  }

  if (!user) {
    router.push({ name: "signin" });
  } else {
    await getProfile(user);
  }
});

async function getProfile(user) {
  try {
    loading.value = true;

    const { data, error } = await supabase
      .from("users")
      .select(`first_name, last_name, email, userroles (roles (role_name))`)
      .eq("id", user.id)
      .single();

    if (error) throw error;

    if (data) {
      firstName.value = data.first_name;
      lastName.value = data.last_name;
      email.value = data.email;
      roleName.value =
        data.userroles && data.userroles.length > 0
          ? data.userroles[0]?.roles.role_name
          : "No Role Assigned";
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    alert("Failed to load profile.");
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    alert("Signed out successfully!");
    router.push({ name: "signin" });
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
