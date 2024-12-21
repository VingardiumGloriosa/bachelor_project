import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "@/services/AuthService";
import { supabase } from "@/supabase/supabase";

// Mock Supabase
vi.mock("@/supabase/supabase", () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      updateUser: vi.fn(),
      verifyOtp: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn(),
      select: vi.fn(),
      eq: vi.fn(),
    }),
    rpc: vi.fn(),
  },
}));

describe("AuthService", () => {
  it("should send a magic link successfully", async () => {
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue({ error: null });

    await expect(
      AuthService.signInWithMagicLink("test@example.com")
    ).resolves.toBe(true);
  });

  it("should throw an error when sending a magic link fails", async () => {
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue({
      error: { message: "Failed to send magic link" },
    });

    await expect(
      AuthService.signInWithMagicLink("test@example.com")
    ).rejects.toThrow("Failed to send magic link");
  });

  it("should log out successfully", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    await expect(AuthService.signOut()).resolves.toBe(true);
  });

  it("should throw an error when logging out fails", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: { message: "Failed to log out" },
    });

    await expect(AuthService.signOut()).rejects.toThrow("Failed to log out");
  });

  it("should assign a user role successfully", async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn().mockResolvedValue({ error: null }),
    } as any);

    await expect(
      AuthService.assignUserRole("user123", 1)
    ).resolves.toBeUndefined();
  });

  it("should handle authentication state changes", async () => {
    const onAuthStateChangeMock = vi.mocked(supabase.auth.onAuthStateChange);
    AuthService.handleAuthStateChange();

    expect(onAuthStateChangeMock).toHaveBeenCalled();
  });

  it("should send OTP successfully", async () => {
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue({ error: null });

    await expect(
      AuthService.signInWithOTP("test@example.com")
    ).resolves.toBeUndefined();
  });

  it("should verify OTP successfully", async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({ error: null });

    await expect(
      AuthService.verifyOTP("test@example.com", "123456")
    ).resolves.toBeUndefined();
  });
});
