<template>
  <v-container class="card">
    <p class="card-txt">
      {{ todayProgram ? "Your programme for today is here!" : randomMessage }}
    </p>
    <v-btn
      v-if="todayProgram"
      class="btn-primary"
      @click="goToProgramme(todayProgram.programme_id, todayProgram.name)"
    >
      Start Now
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "vue-router";
import { isSameDay, parseISO } from "date-fns";

const programmeStore = useProgrammeStore();
const userStore = useUserStore();
const router = useRouter();

const todayProgram = ref(null);
const randomMessage = ref("");
const messages = [
  "Push yourself because no one else is going to do it for you.",
  "Believe you can and you're halfway there.",
  "Your only limit is your mind.",
  "Success doesn’t come from what you do occasionally. It comes from what you do consistently.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Don’t stop until you’re proud.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success is not for the lazy.",
  "Work hard in silence. Let success make the noise.",
  "The body achieves what the mind believes.",
  "Excuses don’t burn calories.",
  "The difference between wanting and achieving is discipline.",
  "Don’t limit your challenges. Challenge your limits.",
];

const fetchTodayProgram = async () => {
  await programmeStore.loadProgrammes(userStore.user.id);
  const today = new Date();

  todayProgram.value = programmeStore.programmes.find((p) => {
    const programDate = p.name.match(/^\d{4}-\d{2}-\d{2}$/)
      ? parseISO(p.name)
      : null;
    return programDate && isSameDay(programDate, today);
  });

  if (!todayProgram.value) {
    randomMessage.value = messages[Math.floor(Math.random() * messages.length)];
  }
};

const goToProgramme = (programmeId: string, programmeName: string) => {
  router.push({
    name: "programme",
    params: { id: programmeId, title: programmeName },
  });
};

onMounted(fetchTodayProgram);
</script>

<style scoped>
.card {
  width: 100%;
  height: 100%;
  padding: 5%;
  background: var(--primary);
  background: linear-gradient(
    90deg,
    rgba(5, 97, 226, 1) 0%,
    rgba(150, 151, 152, 1) 100%
  );
  border-radius: 16px;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-txt {
  font-size: 28px;
  font-weight: 600;
}

.btn-primary {
  background-color: white !important;
  color: var(--primary) !important;
  width: 50%;
  margin-top: 5%;
}
</style>
