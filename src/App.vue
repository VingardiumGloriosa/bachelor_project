<script setup>
import { onMounted, ref } from "vue";
import Account from "./components/profile/Account.vue";
import Auth from "./components/auth/Auth.vue";
import HomeView from "./views/HomeView.vue";
import { supabase } from "./supabase/supabase";

const session = ref(null);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((event, _session) => {
    session.value = _session;
  });
});
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <HomeView v-if="session" :session="session" />
    <Account v-if="session" :session="session" />
    <Auth v-else />
  </div>
</template>
