import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchCurrentUser,
  fetchRolesService,
  signupUserService,
  type User,
  type Role,
} from "@/services/UserService";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const roles = ref<Role[] | null>(null);

  const loadUser = async () => {
    try {
      user.value = await fetchCurrentUser();
    } catch (error) {
      console.error("Error loading user:", (error as Error).message);
      user.value = null;
    }
  };

  const fetchRoles = async () => {
    try {
      roles.value = await fetchRolesService();
    } catch (error) {
      console.error("Error fetching roles:", (error as Error).message);
      roles.value = null;
    }
  };

  const signupUser = async ({
    email,
    firstName,
    lastName,
    roleId,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    roleId: string | number | null;
  }) => {
    try {
      await signupUserService({ email, firstName, lastName, roleId });
    } catch (error) {
      console.error("Error signing up user:", (error as Error).message);
    }
  };

  return {
    user,
    roles,
    loadUser,
    fetchRoles,
    signupUser,
  };
});
