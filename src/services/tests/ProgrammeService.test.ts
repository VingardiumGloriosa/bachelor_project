import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchUserProgrammes,
  fetchProgrammeDetails,
  submitProgrammeService,
  fetchExercisesService,
  fetchPersonalRecordService,
  fetchPersonalRecordsService,
  fetchExerciseHistoryService,
  submitSetService,
  fetchTeamsService,
  fetchUserGoalsService,
  fetchUserPRsService,
} from "@/services/ProgrammeService";
import { supabase } from "@/supabase/supabase";

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    rpc: vi.fn(),
    auth: {
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

describe("programmeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchUserProgrammes should return programmes on success", async () => {
    const mockData = [{ id: "programme1" }, { id: "programme2" }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchUserProgrammes("user123");

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_user_programmes", {
      user_uuid: "user123",
    });
    expect(result).toEqual(mockData);
  });

  it("fetchUserProgrammes should return null on error", async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: null,
      error: { message: "Error" },
    });

    const result = await fetchUserProgrammes("user123");

    expect(result).toBeNull();
  });

  it("fetchProgrammeDetails should return programme details on success", async () => {
    const mockData = { id: "programme1", name: "Test Programme" };
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchProgrammeDetails("programme1");

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_programme_details", {
      programme: "programme1",
    });
    expect(result).toEqual(mockData);
  });

  it("fetchProgrammeDetails should throw error on failure", async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: null,
      error: { message: "Error" },
    });

    await expect(fetchProgrammeDetails("programme1")).rejects.toThrow("Error");
  });

  it("submitProgrammeService should return status and programme_id on success", async () => {
    const mockResponse = { status: "Success", programme_id: "123" };
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockResponse,
      error: null,
    });

    const result = await submitProgrammeService(
      "Test Programme",
      "personal",
      "user123",
      "team123",
      []
    );

    expect(supabase.rpc).toHaveBeenCalledWith(
      "create_programme",
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  it("submitProgrammeService should throw error on failure", async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: null,
      error: { message: "Error" },
    });

    await expect(
      submitProgrammeService(
        "Test Programme",
        "personal",
        "user123",
        "team123",
        []
      )
    ).rejects.toThrow("Error");
  });

  it("fetchExercisesService should return exercises on success", async () => {
    const mockData = [{ id: "exercise1" }, { id: "exercise2" }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchExercisesService();

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_exercises");
    expect(result).toEqual(mockData);
  });

  it("fetchPersonalRecordService should return a PR on success", async () => {
    const mockData = { id: "pr1", weight: 100 };
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchPersonalRecordService(
      "user123",
      "exercise123",
      "5"
    );

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_specific_pr", {
      user_uuid: "user123",
      ex_id: "exercise123",
      rep_scheme_input: "5",
    });
    expect(result).toEqual(mockData);
  });

  it("fetchPersonalRecordsService should return PRs on success", async () => {
    const mockData = [{ id: "pr1" }, { id: "pr2" }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchPersonalRecordsService("user123", "exercise123");

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_exercise_pr", {
      user_uuid: "user123",
      ex_id: "exercise123",
    });
    expect(result).toEqual(mockData);
  });

  it("fetchExerciseHistoryService should return history on success", async () => {
    const mockData = [{ date: "2023-01-01", weight: 100 }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchExerciseHistoryService("user123", "exercise123");

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_exercise_history", {
      p_exercise_id: "exercise123",
      p_user_id: "user123",
    });
    expect(result).toEqual(mockData);
  });

  it("fetchTeamsService should return teams on success", async () => {
    const mockData = [{ id: "team1", name: "Team A" }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchTeamsService();

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_teams");
    expect(result).toEqual(mockData);
  });

  it("fetchUserGoalsService should return user goals on success", async () => {
    const mockData = [{ id: "goal1", name: "Goal A" }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchUserGoalsService("user123");

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_user_goals", {
      user_uuid: "user123",
    });
    expect(result).toEqual(mockData);
  });

  it("fetchUserPRsService should return user PRs on success", async () => {
    const mockData = [{ id: "pr1", weight: 100 }];
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: mockData,
      error: null,
    });

    const result = await fetchUserPRsService("user123");

    expect(supabase.rpc).toHaveBeenCalledWith("fetch_user_prs", {
      user_uuid: "user123",
    });
    expect(result).toEqual(mockData);
  });
});
