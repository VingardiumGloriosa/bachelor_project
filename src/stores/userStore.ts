import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchCurrentUser, fetchUserRoleService } from "@/services/UserService";
import { type User } from "@/components/types/UserTypes";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null); // Ensure it's either a User or null.
  const role = ref<string | null>(null); // Track the user's primary role.

  /**
   * Load the current user using Supabase auth.
   */
  const loadUser = async () => {
    try {
      const currentUser = await fetchCurrentUser();
      if (!currentUser) {
        console.error("No user data found.");
        user.value = null;
        role.value = null;
        return;
      }
      user.value = currentUser;

      const userRole = await fetchUserRole(currentUser.id);
      role.value = userRole;
    } catch (error) {
      console.error("Error loading user:", error.message);
      user.value = null;
      role.value = null;
    }
  };

  /**
   * Fetch the user's role from the service.
   * @param userId The user's UUID.
   * @returns The user's role or null if not found.
   */
  const fetchUserRole = async (userId: string) => {
    try {
      const fetchedRole = await fetchUserRoleService(userId);
      if (fetchedRole) {
        role.value = fetchedRole;
        user.value = {
          ...user.value,
          roles: [fetchedRole],
        } as User;
      }
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
