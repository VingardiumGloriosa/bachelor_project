<template>
  <v-container class="card">
    <p class="card-txt">Your programme for today is here!</p>
    <v-btn class="btn-primary">Start Now</v-btn>
  </v-container>
</template>

<script lang="ts"></script>

<style scoped>
.card {
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
}

.card-txt {
  font-size: 28px;
  margin-right: 25%;
  font-weight: 600;
}

.btn-primary {
  background-color: white !important;
  color: var(--primary) !important;
  width: 50%;
  margin-top: 5%;
}
</style>
