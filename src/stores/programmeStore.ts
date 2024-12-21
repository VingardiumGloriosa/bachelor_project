import { defineStore } from "pinia";
import { ref } from "vue";
import {
  fetchUserProgrammes,
  fetchProgrammeDetails,
  submitProgrammeService,
  fetchExercisesService,
  submitSetService,
  fetchPersonalRecordService,
  fetchPersonalRecordsService,
  fetchExerciseHistoryService,
  fetchTeamsService,
  fetchUserPRsService,
  fetchUserGoalsService,
} from "@/services/programmeService";
import {
  type Programme,
  type Workout,
  type Exercise,
  type Team,
} from "@/components/types/ProgrammeTypes";

/**
 * Pinia store for managing programmes, workouts, exercises, and user-specific records.
 */
export const useProgrammeStore = defineStore("programme", () => {
  const programmes = ref<Programme[]>([]);
  const exercises = ref<Exercise[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const selectedProgramme = ref<Programme | null>(null);
  const programmeId = ref<string | null>(null);
  const status = ref<string | null>(null);
  const teams = ref<Team[]>([]);
  const goals = ref([]);
  const prs = ref([]);

  /**
   * Load all programmes for a user.
   * @param userId - The user's UUID.
   */
  const loadProgrammes = async (userId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchUserProgrammes(userId);
      if (data) programmes.value = data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch details of a specific programme.
   * @param programmeId - The ID of the programme to fetch.
   * @returns The programme details.
   */
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

  /**
   * Submit a new programme.
   * @param programme - The programme object to submit.
   * @param userId - The user's UUID.
   */
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
        programme.team_id,
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

  /**
   * Fetch all exercises available.
   * @returns The list of exercises.
   */
  const fetchExercises = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchExercisesService();
      if (data) exercises.value = data;
      return data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch all teams available to a coach.
   */
  const fetchTeams = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchTeamsService();
      if (data) teams.value = data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Submit workout sets and check for new personal records.
   * @param workouts - The list of workouts and their sets.
   * @param userId - The user's UUID.
   * @returns Submission status and achieved PRs.
   */
  const submitSet = async (
    workouts: Workout[],
    userId: string
  ): Promise<{
    status: string;
    achievedPRs: { exercise: string; weight: number }[];
  }> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await submitSetService(workouts, userId);
      if (response) {
        status.value = response.status;
        return response;
      } else {
        return { status: "Error", achievedPRs: [] };
      }
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error in store:", error.value);
      return { status: "Error", achievedPRs: [] };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch a specific personal record for a user.
   * @param userId - The user's UUID.
   * @param exerciseId - The exercise ID.
   * @param repScheme - The rep scheme for the record.
   * @returns The personal record.
   */
  const fetchPersonalRecord = async (
    userId: string,
    exerciseId: string,
    repScheme: string
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchPersonalRecordService(
        userId,
        exerciseId,
        repScheme
      );
      return data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error fetching personal records in store:", error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch all personal records for a specific exercise.
   * @param userId - The user's UUID.
   * @param exerciseId - The exercise ID.
   */
  const fetchPersonalRecords = async (userId: string, exerciseId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchPersonalRecordsService(userId, exerciseId);
      return data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error fetching personal records in store:", error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch exercise history for a specific user and exercise.
   * @param userId - The user's UUID.
   * @param exerciseId - The exercise ID.
   */
  const fetchExerciseHistory = async (userId: string, exerciseId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchExerciseHistoryService(userId, exerciseId);
      return data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error fetching exercise history in store:", error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch the user's goals.
   * @param userId - The user's UUID.
   * @returns The list of goals.
   */
  const fetchUserGoals = async (userId: string) => {
    try {
      isLoading.value = true;
      const data = await fetchUserGoalsService(userId);
      goals.value = data;
      return data;
    } catch (err) {
      error.value = (err as Error).message || "Failed to fetch user goals.";
      console.error("Error in fetchUserGoals:", error.value);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch the user's personal records (PRs).
   * @param userId - The user's UUID.
   * @returns The list of personal records.
   */
  const fetchUserPRs = async (userId: string) => {
    try {
      isLoading.value = true;
      const data = await fetchUserPRsService(userId);
      prs.value = data;
      return data;
    } catch (err) {
      error.value = (err as Error).message || "Failed to fetch user PRs.";
      console.error("Error in fetchUserPRs:", error.value);
      return [];
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
    fetchUserGoals,
    fetchUserPRs,
    fetchPersonalRecord,
    fetchPersonalRecords,
    fetchExerciseHistory,
    teams,
    fetchTeams,
  };
});
