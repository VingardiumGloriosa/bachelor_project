<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase/supabase";
import TopBar from "@/components/shared/TopBar.vue";
import CoachNavBar from "./components/shared/CoachNavBar.vue";
import AthleteNavBar from "./components/shared/AthleteNavBar.vue";
import { useUserStore } from "@/stores/UserStore";
import { VSonner } from "vuetify-sonner";

const isSignedIn = ref(false);
const userRole = ref<string | null>(null);

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    isSignedIn.value = true;
    const role = await userStore.fetchUserRole(user.id);
    userRole.value = role;
    router.push({ name: "home" });
  } else {
    router.push({ name: "landing" });
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session) {
      isSignedIn.value = true;
      const role = await userStore.fetchUserRole(session.user.id);
      userRole.value = role;
      router.push({ name: "home" });
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
        <AthleteNavBar />
      </div>
      <div v-else-if="userRole === 'Coach'">
        <CoachNavBar />
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
    <VSonner position="top-right" />
    <div id="main-content">
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
.v-toast-container {
  z-index: 9999 !important;
}
</style>
