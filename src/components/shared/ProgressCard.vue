<template>
  <div class="rectangle">
    <v-progress-circular
      :model-value="Math.min((currentWeight / goalWeight) * 100, 100)"
      :size="75"
      :width="5"
      color="var(--primary)"
      class="text-center"
    >
      <span class="headline text-h6"
        >{{
          Math.min((currentWeight / goalWeight) * 100, 100).toFixed(0)
        }}%</span
      >
    </v-progress-circular>
    <Title :title="exerciseName" />
    <p class="text-grey text-body-2">
      {{ Math.max(goalWeight - currentWeight, 0).toFixed(1) }} kg to go
    </p>
  </div>
</template>

<script setup lang="ts">
import Title from "./TitleElement.vue";
import { defineProps } from "vue";

const props = defineProps({
  percentage: {
    type: Number,
    required: true,
  },
  goalWeight: {
    type: Number,
    required: true,
  },
  currentWeight: {
    type: Number,
    required: true,
  },
  exerciseName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.rectangle {
  width: 150px;
  height: 150px;
  background-color: var(--light-grey);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  border-radius: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.headline {
  font-size: 1.2em;
  position: absolute;
  color: white;
}
</style>
