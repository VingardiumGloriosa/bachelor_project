<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/supabase";
import TopBar from "@/components/shared/TopBar.vue";
import NavBar from "./components/shared/CoachNavBar.vue";

const isSignedIn = ref(false);
const userRole = ref<string | null>(null);

const router = useRouter();

const fetchUserRole = async (userId: string) => {
  const { data, error } = await supabase.rpc("fetch_user_role", {
    user_uuid: userId,
  });

  if (error) {
    console.error("Error fetching user roles:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    return data[0].role_name;
  }

  return null;
};

onMounted(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    isSignedIn.value = true;
    const role = await fetchUserRole(user.id);
    userRole.value = role;

    if (role === "Athlete") {
      router.push({ name: "home-athlete" });
    } else if (role === "Coach") {
      router.push({ name: "home-coach" });
    }
  } else {
    router.push({ name: "landing" });
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      isSignedIn.value = true;
      const role = await fetchUserRole(session.user.id);
      userRole.value = role;

      if (role === "Athlete") {
        router.push({ name: "home-athlete" });
      } else if (role === "Coach") {
        router.push({ name: "home-coach" });
      }
    } else if (event === "SIGNED_OUT") {
      isSignedIn.value = false;
      userRole.value = null;
      router.push({ name: "landing" });
    }
  });
});
</script>

<template>
  <div id="app-wrapper">
    <div v-if="isSignedIn">
      <TopBar />
      <div v-if="userRole === 'Athlete'">
        <NavBar />
      </div>
      <div v-else-if="userRole === 'Coach'">
        <NavBar />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
    <div id="main-content">
      <VSonner position="top-right" />
      <router-view />
    </div>
  </div>
</template>

<style scoped>
#app-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 56px;
}
</style>
