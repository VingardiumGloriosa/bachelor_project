import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchCurrentUser, type User } from "@/services/UserService";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  const loadUser = async () => {
    try {
      user.value = await fetchCurrentUser();
    } catch (error) {
      console.error("Error loading user:", (error as Error).message);
      user.value = null;
    }
  };

  return {
    user,
    loadUser,
  };
});
