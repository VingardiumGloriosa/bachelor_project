<template>
  <div class="home-container">
    <ProfileHighlight :user="userStore.user" />

    <form v-if="!loading" @submit.prevent="updateProfile">
      <div>
        <label>Email</label>
        <input type="text" :value="userStore.user.email" disabled />
      </div>
      <div>
        <label>First Name</label>
        <input v-model="userStore.user.first_name" required />
      </div>
      <div>
        <label>Last Name</label>
        <input v-model="userStore.user.last_name" required />
      </div>
      <div>
        <label>Role</label>
        <input type="text" :value="userStore.user.userRole" disabled />
      </div>
      <button type="submit" :disabled="loading">Update Profile</button>
      <button @click="signOut" :disabled="loading">Sign Out</button>
    </form>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { supabase } from "@/supabase/supabase";
import ProfileHighlight from "@/components/profile/ProfileHighlight.vue";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(true);

onMounted(async () => {
  try {
    await userStore.loadUser();

    if (!userStore.user) {
      router.push({ name: "signin" });
    } else {
      await getProfile(userStore.user);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    router.push({ name: "signin" });
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
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.email = data.email;
      userRole.value =
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

const userRole = ref("");

async function updateProfile() {
  try {
    loading.value = true;

    const { error } = await supabase
      .from("users")
      .update({
        first_name: userStore.user.first_name,
        last_name: userStore.user.last_name,
      })
      .eq("id", userStore.user.id);

    if (error) throw error;

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
