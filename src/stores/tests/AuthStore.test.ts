import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/AuthStore";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

// Mock AuthService
vi.mock("@/services/AuthService", () => ({
  AuthService: {
    signInWithMagicLink: vi.fn(),
    signOut: vi.fn(),
    createUser: vi.fn(),
    assignUserRole: vi.fn(),
    storeUserSession: vi.fn(),
    signInWithOTP: vi.fn(),
    verifyOTP: vi.fn(),
    handleAuthStateChange: vi.fn(),
  },
}));

// Mock useRouter
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("useAuthStore", () => {
  let router: ReturnType<typeof useRouter>;

  beforeEach(() => {
    setActivePinia(createPinia());
    router = useRouter();
  });

  it("should initialize with default values", () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("should call AuthService.signInWithMagicLink and handle success", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.signInWithMagicLink).mockResolvedValueOnce(true);

    await store.signInWithMagicLink("test@example.com");

    expect(store.loading).toBe(false);
    expect(AuthService.signInWithMagicLink).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(store.error).toBeNull();
  });

  it("should handle error in signInWithMagicLink", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.signInWithMagicLink).mockRejectedValueOnce(
      new Error("Magic link error")
    );

    await store.signInWithMagicLink("test@example.com");

    expect(store.loading).toBe(false);
    expect(store.error).toBe("Magic link error");
    expect(AuthService.signInWithMagicLink).toHaveBeenCalledWith(
      "test@example.com"
    );
  });

  it("should call AuthService.createUser, assignUserRole, and storeUserSession on createUserAndAssignRole", async () => {
    const store = useAuthStore();
    const mockUserDetails = { firstName: "John", lastName: "Doe", roleId: 1 };
    const mockUserEmail = "test@example.com";
    const mockUser = { id: "user123" };

    vi.mocked(AuthService.createUser).mockResolvedValueOnce(mockUser);
    vi.mocked(AuthService.assignUserRole).mockResolvedValueOnce(undefined);
    vi.mocked(AuthService.storeUserSession).mockResolvedValueOnce(undefined);

    const result = await store.createUserAndAssignRole(
      mockUserDetails,
      mockUserEmail
    );

    expect(AuthService.createUser).toHaveBeenCalledWith(mockUserDetails);
    expect(AuthService.assignUserRole).toHaveBeenCalledWith(
      mockUser.id,
      mockUserDetails.roleId
    );
    expect(AuthService.storeUserSession).toHaveBeenCalledWith(mockUserEmail);
    expect(result).toEqual(mockUser);
  });

  it("should handle errors in createUserAndAssignRole", async () => {
    const store = useAuthStore();
    const mockUserDetails = { firstName: "John", lastName: "Doe", roleId: 1 };
    const mockUserEmail = "test@example.com";

    vi.mocked(AuthService.createUser).mockRejectedValueOnce(
      new Error("Create user error")
    );

    await expect(
      store.createUserAndAssignRole(mockUserDetails, mockUserEmail)
    ).rejects.toThrow("Create user error");

    expect(AuthService.createUser).toHaveBeenCalledWith(mockUserDetails);
  });

  it("should handle error in signOut", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.signOut).mockRejectedValueOnce(
      new Error("Sign out error")
    );

    await store.signOut();

    expect(store.error).toBe("Sign out error");
  });

  it("should call AuthService.signInWithOTP and handle success", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.signInWithOTP).mockResolvedValueOnce(true);

    await store.signInWithOTP("test@example.com");

    expect(AuthService.signInWithOTP).toHaveBeenCalledWith("test@example.com");
    expect(store.error).toBeNull();
  });

  it("should handle error in signInWithOTP", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.signInWithOTP).mockRejectedValueOnce(
      new Error("OTP error")
    );

    await expect(store.signInWithOTP("test@example.com")).rejects.toThrow(
      "OTP error"
    );
    expect(store.error).toBe("OTP error");
  });

  it("should call AuthService.verifyOTP and handle success", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.verifyOTP).mockResolvedValueOnce(true);

    await store.verifyOTP("test@example.com", "123456");

    expect(AuthService.verifyOTP).toHaveBeenCalledWith(
      "test@example.com",
      "123456"
    );
    expect(store.error).toBeNull();
  });

  it("should handle error in verifyOTP", async () => {
    const store = useAuthStore();
    vi.mocked(AuthService.verifyOTP).mockRejectedValueOnce(
      new Error("Invalid OTP")
    );

    await expect(store.verifyOTP("test@example.com", "123456")).rejects.toThrow(
      "Invalid OTP"
    );
    expect(store.error).toBe("Invalid OTP");
  });

  it("should initialize auth state change listener", () => {
    const handleAuthStateChangeMock = vi.mocked(
      AuthService.handleAuthStateChange
    );
    expect(handleAuthStateChangeMock).toHaveBeenCalled();
  });
});
