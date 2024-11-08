<template>
  <v-app>
    <v-main>
      <div class="connection-test">
        <h2>Database Connection Test</h2>
        <button @click="testConnection">Test Connection</button>
        <div v-if="users.length > 0">
          <h3>Users:</h3>
          <ul>
            <li v-for="user in users" :key="user.id">
              {{ user.first_name }} {{ user.last_name }}
            </li>
          </ul>
        </div>
        <p v-else>No users found or error fetching data.</p>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { supabase } from "./supabase";

export default {
  name: "App",

  data() {
    return {
      users: [],
    };
  },

  methods: {
    async testConnection() {
      try {
        const { data, error } = await supabase
          .from("u  sers")
          .select("*")
          .limit(10);

        if (error) throw error;

        this.users = data;
        console.log("Fetched users:", data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    },
  },
};
</script>

<style>
.connection-test {
  padding: 20px;
}

.connection-test button {
  margin: 10px 0;
}
</style>
