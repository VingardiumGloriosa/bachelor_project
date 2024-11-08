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

<script setup>
import { ref } from "vue"; // Import ref for reactive state
import { supabase } from "./supabase"; // Supabase client

// Define the reactive state using `ref`
const users = ref([]);

// Define the `testConnection` method
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(10);

    if (error) throw error;

    users.value = data; // Assign fetched data to the reactive state
    console.log("Fetched users:", data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
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
