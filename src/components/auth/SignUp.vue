<template>
  <arrow-back @click="close" class="backbtn" />
  <v-container class="general">
    <h1>Sign Up</h1>
    <v-form @submit.prevent="handleSignup">
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
        :items="roles"
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
import { ref, onMounted, watch } from "vue";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "vue-router";
import ArrowBack from "../shared/ArrowBack.vue";

const email = ref("");
const firstName = ref("");
const lastName = ref("");
const roleId = ref(null);
const roles = ref([]);
const loading = ref(false);
const router = useRouter();

//TO FIX
const fetchRoles = async () => {
  try {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) throw error;
    roles.value = data;
    console.log("Fetched roles:", roles.value);
  } catch (error) {
    console.error("Error fetching roles:", error.message);
  }
};

watch(roleId, (newValue) => {
  console.log("Selected roleId:", newValue);
});

onMounted(() => {
  console.log("Component mounted, fetching roles...");
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
