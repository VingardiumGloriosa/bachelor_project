import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchCurrentUser, fetchUserRoleService } from "@/services/UserService";
import { type User } from "@/components/types/UserTypes";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null | undefined>(undefined);
  const role = ref(null);
  const loadUser = async () => {
    try {
      user.value = await fetchCurrentUser();
    } catch (error) {
      console.error("Error loading user:", error.message);
      user.value = null;
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      const fetchedRole = await fetchUserRoleService(userId);
      role.value = fetchedRole;
      return fetchedRole;
    } catch (error) {
      console.error("Error fetching user role:", error.message);
      return null;
    }
  };

  return {
    user,
    role,
    loadUser,
    fetchUserRole,
  };
});
