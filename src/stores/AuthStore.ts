import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const router = useRouter();

  const signInWithMagicLink = async (email: string) => {
    try {
      loading.value = true;
      await AuthService.signInWithMagicLink(email);
      router.push({ name: "check-email" });
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      loading.value = true;
      await AuthService.signOut();
      user.value = null;
      router.push({ name: "signin" });
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      loading.value = true;
      user.value = await AuthService.getCurrentUser();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithMagicLink,
    signOut,
    fetchCurrentUser,
  };
});
