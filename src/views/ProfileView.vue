<template>
  <div class="home-container">
    <v-container class="card">
      <div class="top-left">
        <span v-if="!isEditing" class="username">
          {{ userStore.user.first_name }} {{ userStore.user.last_name }}
        </span>
        <input
          v-if="isEditing"
          v-model="userStore.user.first_name"
          class="editable-input"
          type="text"
          placeholder="First Name"
        />
        <input
          v-if="isEditing"
          v-model="userStore.user.last_name"
          class="editable-input"
          type="text"
          placeholder="Last Name"
        />
      </div>

      <div class="bottom-left">
        <div class="team-name">
          {{ userStore.user.team?.name || "TO BE FIXED" }}
        </div>

        <div class="email">
          <span v-if="!isEditing" class="email">{{
            userStore.user.email
          }}</span>
          <input
            v-if="isEditing"
            v-model="userStore.user.email"
            class="editable-input"
            type="email"
            placeholder="Email"
          />
        </div>
      </div>

      <div class="top-right" @click="editProfile">
        <v-icon>mdi-pencil</v-icon>
      </div>

      <div v-if="isEditing" class="buttons">
        <button @click="saveProfile" :disabled="loading">Save</button>
        <button @click="cancelEdit" :disabled="loading">Cancel</button>
      </div>
    </v-container>
    <GoalProgress />
    <v-btn class="btn-primary" @click="authStore.signOut()">Sign Out</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { supabase } from "@/supabase/supabase";
import { useAuthStore } from "@/stores/AuthStore";
import GoalProgress from "@/components/home/GoalProgress.vue";
import { useToastStore, ToastType } from "@/stores/ToastStore";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(true);
const isEditing = ref(false);
const authStore = useAuthStore();
const toastStore = useToastStore();

onMounted(async () => {
  try {
    await userStore.loadUser();

    if (!userStore.user) {
      router.push({ name: "signin" });
    } else {
      console.log(userStore.user);
      await getProfile(userStore.user.id);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    router.push({ name: "signin" });
  }
});

async function getProfile(userId: string) {
  try {
    loading.value = true;
    console.log(userId);
    const { data, error } = await supabase.rpc("fetch_user_profile", {
      user_id: userId,
    });
    if (error) {
      throw error;
    }
    userStore.user.first_name = data.first_name;
    userStore.user.last_name = data.last_name;
    userStore.user.email = data.email;
    userStore.user.roles = data.roles;
    userStore.user.team = data.team;
  } catch (error) {
    console.error("Error fetching profile:", error);
    toastStore.toast("Failed to load profile.", ToastType.ERROR);
  } finally {
    loading.value = false;
  }
}

async function saveProfile() {
  try {
    loading.value = true;

    const { error } = await supabase
      .from("users")
      .update({
        first_name: userStore.user.first_name,
        last_name: userStore.user.last_name,
        email: userStore.user.email,
        team: userStore.user.team,
      })
      .eq("id", userStore.user.id);

    if (error) throw error;

    toastStore.toast("Profile updated successfully!", ToastType.SUCCESS);
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
    toastStore.toast("Failed to update profile.", ToastType.ERROR);
  } finally {
    loading.value = false;
  }
}

function editProfile() {
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}
</script>

<style scoped>
.card {
  position: relative;
  width: 100%;
  height: 250px;
  background: var(--primary);
  background: linear-gradient(
    90deg,
    rgba(5, 97, 226, 1) 0%,
    rgba(150, 151, 152, 1) 100%
  );
  border-radius: 16px;
  margin-top: 5%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-left {
  position: absolute;
  top: 16px;
  left: 16px;
  color: white;
}

.username,
.teamname,
.email {
  font-size: 16px;
  font-weight: bold;
}

.editable-input {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
}

.bottom-left {
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: white;
}

.top-right {
  position: absolute;
  top: 16px;
  right: 16px;
  color: rgb(0, 0, 0);
  cursor: pointer;
}

.v-icon {
  font-size: 24px;
}

.buttons {
  margin-top: 10px;
}

.buttons button {
  padding: 8px 16px;
  font-size: 14px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:disabled {
  background-color: #ccc;
}

.v-btn {
  width: 100%;
}
</style>
