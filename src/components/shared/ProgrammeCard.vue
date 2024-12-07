<template>
  <div class="programme">
    <h2>{{ dayOfWeek }}</h2>
    <p>{{ formattedDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { parseISO, isValid, format } from "date-fns";

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
});

const isValidDate = (dateString: string) => {
  const dateObj = parseISO(dateString);
  return isValid(dateObj);
};

const dayOfWeek = computed(() => {
  if (isValidDate(props.date)) {
    const dateObj = parseISO(props.date);
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
  } else {
    return props.date;
  }
});

const formattedDate = computed(() => {
  if (isValidDate(props.date)) {
    const dateObj = parseISO(props.date);
    return format(dateObj, "MMMM dd, yyyy");
  } else {
    return null;
  }
});
</script>

<style scoped>
.programme {
  padding: 1em;
  border-radius: 16px;
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
