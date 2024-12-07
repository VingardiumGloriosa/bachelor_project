<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    transition="slide-x-reverse-transition"
    offset-y
    :nudge-top="10"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-bind="attrs"
        v-on="on"
        v-model="formattedDate"
        label="Select Date"
        append-icon="mdi-calendar"
        readonly
        @click="handleTextFieldClick"
      />
    </template>
    <v-date-picker v-model="selectedDate" :min="minDate" class="ml-12 mt-16" />
    <v-btn
      color="primary"
      @click="handleOkClick"
      class="mt-4 ml-auto d-block"
      style="max-width: 120px"
    >
      Select Date
    </v-btn>
  </v-menu>
</template>

<script setup>
import { ref, computed, defineEmits } from "vue";
import { format } from "date-fns";

const menuVisible = ref(false);
const selectedDate = ref(null);
const minDate = ref(new Date().toISOString().substr(0, 10));
const emit = defineEmits(["updateName"]);

const closeMenu = () => {
  menuVisible.value = false;
};

const handleOkClick = () => {
  if (selectedDate.value) {
    const formatted = format(new Date(selectedDate.value), "yyyy-MM-dd");
    emit("updateName", formatted);
  }
  closeMenu();
};

const handleTextFieldClick = () => {
  menuVisible.value = true;
};

const formattedDate = computed(() => {
  return selectedDate.value
    ? format(new Date(selectedDate.value), "yyyy-MM-dd")
    : "";
});
</script>

<style scoped>
.v-text-field input {
  cursor: pointer;
}
</style>
