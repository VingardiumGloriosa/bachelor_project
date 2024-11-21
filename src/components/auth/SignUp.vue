<template>
  <arrow-back @click="close" class="backbtn" />
  <v-container class="general">
    <h1>Sign Up</h1>
    <!-- Use a handler function in @submit.prevent -->
    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="email"
        label="Email Address"
        type="email"
        required
        variant="outlined"
        rounded="lg"
      />
      <v-text-field
        v-model="firstName"
        label="First Name"
        type="text"
        required
        variant="outlined"
        rounded="lg"
      />
      <v-text-field
        v-model="lastName"
        label="Last Name"
        type="text"
        required
        variant="outlined"
        rounded="lg"
      />
      <v-select
        class="style-chooser"
        v-model="roleId"
        :items="userStore.roles"
        label="Role"
        required
        variant="outlined"
        rounded="lg"
        item-title="role_name"
        item-value="role_id"
      />
      <v-btn
        class="btn-primary"
        :loading="loading"
        :disabled="loading"
        type="submit"
        rounded
      >
        Continue
      </v-btn>
      <p class="text-center">Already have an account?</p>
      <p class="text-center text-grey" @click="signin">Sign In</p>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "vue-router";
import ArrowBack from "../shared/ArrowBack.vue";

const email = ref("");
const firstName = ref("");
const lastName = ref("");
const roleId = ref(null);
const loading = ref(false);
const router = useRouter();

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchRoles();
});

const handleSubmit = async () => {
  try {
    loading.value = true;

    await userStore.signupUser({
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      roleId: roleId.value,
    });

    alert("Check your email for a magic link to complete sign-up!");
  } catch (error) {
    console.error("Error during sign-up:", error.message);
  } finally {
    loading.value = false;
  }
};

function close() {
  router.push("/");
}

const signin = () => {
  router.push("/signin");
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
