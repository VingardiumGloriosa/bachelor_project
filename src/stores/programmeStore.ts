import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchUserProgrammes,
  fetchProgrammeDetails,
  submitProgrammeService,
  fetchExercisesService,
  submitSetService,
} from "@/services/ProgrammeService";
import {
  type Programme,
  type Workout,
} from "@/components/types/ProgrammeTypes";

interface Exercise {
  name: string;
  exercise_id: number;
}

export const useProgrammeStore = defineStore("programme", () => {
  const programmes = ref<Programme[]>([]);
  const exercises = ref<Exercise[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedProgramme = ref<Programme | null>(null);
  const programmeId = ref<string | null>(null);
  const status = ref<string | null>(null);

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

  const getProgrammeDetails = async (programmeId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchProgrammeDetails(programmeId);
      return data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const submitProgramme = async (
    programme: Programme,
    userId: string
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await submitProgrammeService(
        programme.name,
        programme.type,
        userId,
        programme.workouts
      );

      if (response) {
        status.value = response.status;
        programmeId.value = response.programme_id || null;
      }
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchExercises = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchExercisesService();
      if (data) {
        exercises.value = data;
      }
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const submitSet = async (
    workouts: Workout[],
    userId: string
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await submitSetService(workouts, userId);

      if (response) {
        status.value = response.status;
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
    status,
    programmeId,
    submitProgramme,
    loadProgrammes,
    getProgrammeDetails,
    selectedProgramme,
    fetchExercises,
    exercises,
    submitSet,
  };
});
