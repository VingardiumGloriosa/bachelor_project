<template>
  <v-container>
    <v-slide-group class="carousel" v-model="selected">
      <v-slide-item
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item"
      >
        <CustomRectangle :percentage="95" />
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import CustomRectangle from "@/components/shared/ProgressCard.vue";

const items = [
  "Rectangle 1",
  "Rectangle 2",
  "Rectangle 3",
  "Rectangle 4",
  "Rectangle 5",
  "Rectangle 6",
];

const selected = ref(0);
</script>

<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.v-container {
  padding: 0;
}
::v-deep .v-slide-group__content {
  gap: 10px !important;
}
</style>
