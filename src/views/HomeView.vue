<template>
  <component :is="componentToRender" />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/UserStore";
import HomeAthlete from "./HomeAthleteView.vue";
import HomeCoach from "./HomeCoachView.vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const componentToRender = ref(null);

onMounted(async () => {
  if (!userStore.user) {
    await userStore.loadUser();
  }

  if (userStore.user) {
    const userId = userStore.user.id;
    let userRole = userStore.role;
    if (!userRole) {
      userRole = await userStore.fetchUserRole(userId);
    }

    if (userRole === "Athlete") {
      componentToRender.value = HomeAthlete;
    } else if (userRole === "Coach") {
      componentToRender.value = HomeCoach;
    } else {
      router.push("/");
    }
  } else {
    router.push("/signin");
  }
});
</script>
