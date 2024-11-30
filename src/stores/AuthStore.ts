import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const router = useRouter();

  const signInWithMagicLink = async (
    email: string,
    userDetails: { firstName: string; lastName: string; roleId: number }
  ) => {
    try {
      loading.value = true;
      await AuthService.signInWithMagicLink(email);
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      alert("Check your email for a magic link to complete sign-up!");
    } catch (err) {
      error.value = err.message;
      console.error("Error during magic link sign-in:", err.message);
    } finally {
      loading.value = false;
    }
  };

  AuthService.handleAuthStateChange();

  return { user, loading, error, signInWithMagicLink };
});
