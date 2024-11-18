import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/supabase/supabase";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  const loadUser = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user.value = currentUser;
  };

  return {
    user,
    loadUser,
  };
});
