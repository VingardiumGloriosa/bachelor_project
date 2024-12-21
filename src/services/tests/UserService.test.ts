import { describe, it, expect, vi } from "vitest";
import { fetchUserRoleService, fetchCurrentUser } from "@/services/UserService";
import { supabase } from "@/supabase/supabase";

vi.mock("@/supabase/supabase", () => ({
  supabase: {
    rpc: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe("UserService", () => {
  describe("fetchUserRoleService", () => {
    it("fetches the user's role successfully", async () => {
      // Mock Supabase RPC call
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: [{ role_name: "Admin" }],
        error: null,
      });

      const role = await fetchUserRoleService("user123");
      expect(role).toBe("Admin");
    });

    it("returns null if an error occurs", async () => {
      // Mock Supabase RPC call with an error
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: "Role fetch error" },
      });

      const role = await fetchUserRoleService("user123");
      expect(role).toBeNull();
    });
  });

  describe("fetchCurrentUser", () => {
    it("fetches the current user successfully", async () => {
      // Mock Supabase auth.getUser
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: "user123", email: "test@example.com" } },
        error: null,
      });

      const user = await fetchCurrentUser();
      expect(user).toEqual({ id: "user123", email: "test@example.com" });
    });

    it("returns null if an error occurs", async () => {
      // Mock Supabase auth.getUser with an error
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: null,
        error: { message: "User fetch error" },
      });

      const user = await fetchCurrentUser();
      expect(user).toBeNull();
    });
  });
});
