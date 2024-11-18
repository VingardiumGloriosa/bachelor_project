<template>
  <div class="rectangle">
    <v-progress-circular
      model-value="95"
      :size="75"
      :width="5"
      color="var(--primary)"
      class="text-center"
    >
      <span class="headline text-h6">{{ percentage }}%</span>
    </v-progress-circular>
    <Title title="Snatch" />
    <p class="text-grey text-body-2">4 kg to go</p>
  </div>
</template>

<script setup lang="ts">
import Title from "./Title.vue";

const props = defineProps({
  percentage: {
    type: Number,
    default: 95,
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
