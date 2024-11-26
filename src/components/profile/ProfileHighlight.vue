<template>
  <v-container class="card">
    <img
      src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
      alt="user-avatar"
      class="avatar-img"
    />
    <div class="top-left">
      <span class="username">props.user.name</span>
    </div>
    <div class="bottom-left">
      <div class="team-name">
        <span class="teamname">props.user.team</span>
      </div>
      <div class="email">
        <span class="email">props.user.email</span>
      </div>
    </div>
    <div class="top-right">
      <v-icon>mdi-pencil</v-icon>
    </div>
  </v-container>
</template>

<script lang="ts">
import { type User } from "@/components/types/UserTypes";
import { defineProps } from "vue";

const props = defineProps<{
  user: User;
}>();
</script>

<style scoped>
.card {
  position: relative;
  width: 100%;
  height: 250px;
  background: var(--primary);
  background: linear-gradient(
    90deg,
    rgba(5, 97, 226, 1) 0%,
    rgba(150, 151, 152, 1) 100%
  );
  border-radius: 16px;
  margin-top: 5%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-img {
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  top: 15%;
  left: 40%;
  width: 200px;
}

.top-left {
  position: absolute;
  top: 16px;
  left: 16px;
  color: white;
}

.username {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.bottom-left {
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: white;
}

.team-name,
.email {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  margin-top: 4px;
}

.top-right {
  position: absolute;
  top: 16px;
  right: 16px;
  color: rgb(0, 0, 0);
}

.v-icon {
  font-size: 24px;
}
</style>
