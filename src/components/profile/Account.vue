<script setup>
import { supabase } from "@/supabase/supabase";
import { onMounted, ref, toRefs } from "vue";

const props = defineProps(["session"]);
const { session } = toRefs(props);

const loading = ref(true);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const roleName = ref("");

onMounted(() => {
  getProfile();
});

async function getProfile() {
  try {
    loading.value = true;
    const { user } = session.value;

    // Fetch user profile and role
    const { data, error, status } = await supabase
      .from("users")
      .select(
        `
        first_name, 
        last_name, 
        email,
        userroles (
          roles (
            role_name
          )
        )
      `
      )
      .eq("id", user.id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      firstName.value = data.first_name;
      lastName.value = data.last_name;
      email.value = data.email;

      // Ensure role data exists, otherwise alert the user
      if (data.userroles && data.userroles.length > 0) {
        roleName.value = data.userroles[0].roles.role_name; // Assuming a user can only have one role
      } else {
        alert("No role assigned. Please contact support.");
      }
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  try {
    loading.value = true;
    const { user } = session.value;

    // Prepare updates for profile
    const updates = {
      id: user.id,
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
    };

    const { error } = await supabase.from("users").upsert(updates);

    if (error) throw error;

    alert("Profile updated successfully!");
  } catch (error) {
    alert(error.message);
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
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="updateProfile">
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
</template>
