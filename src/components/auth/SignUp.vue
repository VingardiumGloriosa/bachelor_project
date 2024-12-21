<template>
  <arrow-back @click="close" class="backbtn" />
  <v-container class="general">
    <h1>Sign-up</h1>
    <v-form v-if="!otpSent" @submit.prevent="requestOTP">
      <p>Email Address</p>
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
        variant="outlined"
        rounded="lg"
      />
      <v-btn
        class="btn-primary"
        :loading="auth.loading"
        :disabled="auth.loading"
        type="submit"
      >
        Request OTP
      </v-btn>
      <p class="text-grey text-center">Already have an account?</p>
      <p class="text-center" @click="signup">Log-in</p>
    </v-form>

    <v-form v-else @submit.prevent="verifyOTP">
      <p>First Name</p>
      <v-text-field
        v-model="firstName"
        label="First Name"
        type="text"
        required
        variant="outlined"
        rounded="lg"
      />
      <p>Last Name</p>
      <v-text-field
        v-model="lastName"
        label="Last Name"
        type="text"
        required
        variant="outlined"
        rounded="lg"
      />
      <p>Enter OTP</p>
      <v-text-field
        v-model="otp"
        label="One-Time Password"
        type="text"
        required
        variant="outlined"
        rounded="lg"
      />
      <v-btn
        class="btn-primary"
        :loading="auth.loading"
        :disabled="auth.loading"
        type="submit"
      >
        Create Profile
      </v-btn>
      <p class="text-center text-grey" @click="resetOTP">Resend OTP</p>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/AuthStore";
import { useToastStore, ToastType } from "@/stores/ToastStore";
import ArrowBack from "../shared/ArrowBack.vue";
import { createAthleteProfileService } from "@/services/UserService";

const email = ref("");
const otp = ref("");
const firstName = ref("");
const lastName = ref("");
const otpSent = ref(false);
const router = useRouter();
const auth = useAuthStore();
const toastStore = useToastStore();

const requestOTP = async () => {
  try {
    await auth.signInWithOTP(email.value);
    otpSent.value = true;
    toastStore.toast(
      "OTP sent to your email. Please check!",
      ToastType.SUCCESS
    );
  } catch (error) {
    console.error("Error requesting OTP:", error.message);
    toastStore.toast("Failed to send OTP. Please try again.", ToastType.ERROR);
  }
};

const verifyOTP = async () => {
  try {
    await auth.verifyOTP(email.value, otp.value);
    console.log(auth);
    await createAthleteProfileService(
      email.value,
      firstName.value,
      lastName.value
    );
    toastStore.toast("Profile created!", ToastType.SUCCESS);
    router.push("/home");
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    toastStore.toast("Invalid OTP. Please try again.", ToastType.ERROR);
  }
};

const resetOTP = () => {
  otpSent.value = false;
};

const close = () => {
  router.push("/");
};

const signup = () => {
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
  gap: 10px;
}

.backbtn {
  position: absolute;
  top: 20px;
  left: 20px;
}

.v-btn {
  width: 100%;
}

.text-grey {
  color: grey;
  cursor: pointer;
}
</style>
