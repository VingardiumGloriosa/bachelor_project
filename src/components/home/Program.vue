<template>
  <div class="programme">
    <h2>{{ dayOfWeek }}</h2>
    <p>{{ formattedDate }}</p>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
});

const dayOfWeek = computed(() => {
  const dateObj = new Date(props.date);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dateObj.getDay()];
});

const formattedDate = computed(() => {
  const dateObj = new Date(props.date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<style scoped>
.programme {
  padding: 1em;
  border-radius: 8px;
  background-color: var(--light-grey);
}

h2 {
  color: var(--primary);
  font-size: 1.5em;
}

p {
  color: white;
  font-size: 1.25em;
}
</style>
