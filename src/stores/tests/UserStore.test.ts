import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useUserStore } from "@/stores/UserStore";
import { fetchCurrentUser, fetchUserRoleService } from "@/services/UserService";

// Mock the services
vi.mock("@/services/UserService", () => ({
  fetchCurrentUser: vi.fn(),
  fetchUserRoleService: vi.fn(),
}));

describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with null user and role", () => {
    const store = useUserStore();
    expect(store.user).toBeNull();
    expect(store.role).toBeNull();
  });

  it("handles errors when loading the current user", async () => {
    // Mock fetchCurrentUser to throw an error
    vi.mocked(fetchCurrentUser).mockRejectedValue(
      new Error("User fetch error")
    );

    const store = useUserStore();
    await store.loadUser();

    expect(store.user).toBeNull();
    expect(store.role).toBeNull();
  });

  it("fetches the user's role", async () => {
    // Mock fetchUserRoleService to return a role
    vi.mocked(fetchUserRoleService).mockResolvedValue("Manager");

    const store = useUserStore();
    const role = await store.fetchUserRole("user123");

    expect(role).toBe("Manager");
    expect(store.role).toBe("Manager");
  });

  it("handles errors when fetching the user's role", async () => {
    // Mock fetchUserRoleService to throw an error
    vi.mocked(fetchUserRoleService).mockRejectedValue(
      new Error("Role fetch error")
    );

    const store = useUserStore();
    const role = await store.fetchUserRole("user123");

    expect(role).toBeNull();
    expect(store.role).toBeNull();
  });
});
