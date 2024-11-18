import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchUserProgrammes,
  fetchProgrammeDetails,
} from "@/services/programmeService";
import { type Programme } from "@/components/types/programmeTypes";

export const useProgrammeStore = defineStore("programme", () => {
  const programmes = ref<Programme[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedProgramme = ref<Programme | null>(null);

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

  return {
    programmes,
    isLoading,
    error,
    loadProgrammes,
    getProgrammeDetails,
    selectedProgramme,
  };
});
