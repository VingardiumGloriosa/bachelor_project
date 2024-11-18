import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchUserProgrammes } from "@/services/programmeService";

interface Set {
  set_id: string;
  reps: number;
  weight: number;
  is_max: boolean;
}

interface Exercise {
  exercise_id: string;
  name: string;
  sets: Set[];
}

interface Workout {
  workout_id: string;
  name: string;
  exercises: Exercise[];
}

interface Programme {
  programme_id: string;
  name: string;
  workouts: Workout[];
}

export const useProgrammeStore = defineStore("programme", () => {
  const programmes = ref<Programme[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const loadProgrammes = async (userId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchUserProgrammes(userId);
      if (data) {
        programmes.value = data;
      }
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    programmes,
    isLoading,
    error,
    loadProgrammes,
  };
});
