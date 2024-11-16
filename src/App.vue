<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "vue-router";
import NavBar from "@/components/shared/NavBar.vue";
import TopBar from "@/components/shared/TopBar.vue";

const router = useRouter();
const isSignedIn = ref(false);

onMounted(async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    isSignedIn.value = true;
    router.push({ name: "home" });
  } else {
    router.push({ name: "landing" });
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      console.log("User signed in: ", session.user);
      isSignedIn.value = true;
      router.push({ name: "home" });
    } else if (event === "SIGNED_OUT") {
      isSignedIn.value = false;
      router.push({ name: "landing" });
    }
  });
});
</script>

<template>
  <div v-if="isSignedIn">
    <TopBar />
    <NavBar style="margin-left: -2%; padding-right: 2%" />
  </div>
  <router-view></router-view>
</template>

<style scoped></style>
