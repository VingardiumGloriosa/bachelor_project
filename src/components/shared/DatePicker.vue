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
        class="styled-text-field"
        @click="handleTextFieldClick"
      />
    </template>
    <div v-if="menuVisible" class="overlay">
      <div class="date-picker-wrapper">
        <v-date-picker
          v-model="selectedDate"
          :min="minDate"
          class="date-picker"
        />
        <div class="action-buttons">
          <v-btn color="primary" @click="handleOkClick" class="btn-select-date">
            Select Date
          </v-btn>
          <v-btn color="secondary" @click="closeMenu" class="btn-cancel">
            Cancel
          </v-btn>
        </div>
      </div>
    </div>
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
.v-text-field {
  max-width: 300px;
  font-family: Arial, sans-serif;
}

.styled-text-field input {
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.date-picker-wrapper {
  background: var(--dark-grey);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
}

.date-picker {
  background: var(--dark-grey);
  border-radius: 8px;
  color: white;
}

.date-picker .v-date-picker-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary);
}

.date-picker .v-date-picker-header {
  color: var(--light-grey);
}

.date-picker .v-btn.v-btn--active {
  background-color: var(--blue) !important;
  color: white !important;
}

.date-picker .v-btn {
  color: var(--light-grey) !important;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.btn-select-date {
  background-color: var(--green) !important;
  color: black !important;
  font-weight: bold;
}

.btn-cancel {
  background-color: var(--red) !important;
  font-weight: bold;
}
</style>
