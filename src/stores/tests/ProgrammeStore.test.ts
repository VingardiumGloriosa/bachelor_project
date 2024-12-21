import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProgrammeStore } from "@/stores/ProgrammeStore";
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
  fetchUserGoalsService,
  fetchUserPRsService,
} from "@/services/programmeService";

vi.mock("@/services/programmeService", () => ({
  fetchUserProgrammes: vi.fn(),
  fetchProgrammeDetails: vi.fn(),
  submitProgrammeService: vi.fn(),
  fetchExercisesService: vi.fn(),
  submitSetService: vi.fn(),
  fetchPersonalRecordService: vi.fn(),
  fetchPersonalRecordsService: vi.fn(),
  fetchExerciseHistoryService: vi.fn(),
  fetchTeamsService: vi.fn(),
  fetchUserGoalsService: vi.fn(),
  fetchUserPRsService: vi.fn(),
}));

describe("Programme Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loads programmes successfully", async () => {
    const mockProgrammes = [{ id: "programme1" }, { id: "programme2" }];
    vi.mocked(fetchUserProgrammes).mockResolvedValueOnce(mockProgrammes);

    const store = useProgrammeStore();
    await store.loadProgrammes("user123");

    expect(fetchUserProgrammes).toHaveBeenCalledWith("user123");
    expect(store.programmes).toEqual(mockProgrammes);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("handles error when loading programmes", async () => {
    vi.mocked(fetchUserProgrammes).mockRejectedValueOnce(
      new Error("Load error")
    );

    const store = useProgrammeStore();
    await store.loadProgrammes("user123");

    expect(store.programmes).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe("Load error");
  });

  it("fetches programme details successfully", async () => {
    const mockProgramme = { id: "programme1", name: "Test Programme" };
    vi.mocked(fetchProgrammeDetails).mockResolvedValueOnce(mockProgramme);

    const store = useProgrammeStore();
    const result = await store.getProgrammeDetails("programme1");

    expect(fetchProgrammeDetails).toHaveBeenCalledWith("programme1");
    expect(result).toEqual(mockProgramme);
  });

  it("submits a programme successfully", async () => {
    const mockResponse = { status: "Success", programme_id: "123" };
    vi.mocked(submitProgrammeService).mockResolvedValueOnce(mockResponse);

    const store = useProgrammeStore();
    const programme = {
      name: "Test Programme",
      type: "personal",
      team_id: "team1",
      workouts: [],
    };

    await store.submitProgramme(programme, "user123");

    expect(submitProgrammeService).toHaveBeenCalledWith(
      "Test Programme",
      "personal",
      "user123",
      "team1",
      []
    );
    expect(store.status).toBe("Success");
    expect(store.programmeId).toBe("123");
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("handles error when submitting a programme", async () => {
    vi.mocked(submitProgrammeService).mockRejectedValueOnce(
      new Error("Submit error")
    );

    const store = useProgrammeStore();
    const programme = {
      name: "Test Programme",
      type: "personal",
      team_id: "team1",
      workouts: [],
    };

    await store.submitProgramme(programme, "user123");

    expect(store.status).toBeNull();
    expect(store.programmeId).toBeNull();
    expect(store.error).toBe("Submit error");
  });

  it("fetches exercises successfully", async () => {
    const mockExercises = [{ id: "exercise1" }, { id: "exercise2" }];
    vi.mocked(fetchExercisesService).mockResolvedValueOnce(mockExercises);

    const store = useProgrammeStore();
    await store.fetchExercises();

    expect(fetchExercisesService).toHaveBeenCalled();
    expect(store.exercises).toEqual(mockExercises);
  });

  it("submits a set successfully", async () => {
    const mockResponse = {
      status: "Success",
      achievedPRs: [{ exercise: "Bench Press", weight: 100 }],
    };
    vi.mocked(submitSetService).mockResolvedValueOnce(mockResponse);

    const store = useProgrammeStore();
    const workouts = [
      {
        workout_id: "workout1",
        workout_exercises: [
          {
            exercise_id: "exercise1",
            sets: [{ set_id: "set1", weight: 100, success: true }],
          },
        ],
      },
    ];

    const result = await store.submitSet(workouts, "user123");

    expect(submitSetService).toHaveBeenCalledWith(workouts, "user123");
    expect(result).toEqual(mockResponse);
  });

  it("fetches teams successfully", async () => {
    const mockTeams = [{ id: "team1", name: "Team A" }];
    vi.mocked(fetchTeamsService).mockResolvedValueOnce(mockTeams);

    const store = useProgrammeStore();
    await store.fetchTeams();

    expect(fetchTeamsService).toHaveBeenCalled();
    expect(store.teams).toEqual(mockTeams);
  });

  it("fetches personal records successfully", async () => {
    const mockPRs = [{ id: "pr1", weight: 100 }];
    vi.mocked(fetchPersonalRecordsService).mockResolvedValueOnce(mockPRs);

    const store = useProgrammeStore();
    const result = await store.fetchPersonalRecords("user123", "exercise123");

    expect(fetchPersonalRecordsService).toHaveBeenCalledWith(
      "user123",
      "exercise123"
    );
    expect(result).toEqual(mockPRs);
  });

  it("fetches exercise history successfully", async () => {
    const mockHistory = [{ date: "2023-01-01", weight: 100 }];
    vi.mocked(fetchExerciseHistoryService).mockResolvedValueOnce(mockHistory);

    const store = useProgrammeStore();
    const result = await store.fetchExerciseHistory("user123", "exercise123");

    expect(fetchExerciseHistoryService).toHaveBeenCalledWith(
      "user123",
      "exercise123"
    );
    expect(result).toEqual(mockHistory);
  });
});
