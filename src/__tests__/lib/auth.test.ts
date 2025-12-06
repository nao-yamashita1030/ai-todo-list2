import { getCurrentUserId } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";

// Clerkのモック
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

describe("getCurrentUserId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーの場合、ユーザーIDを返す", async () => {
    const mockUserId = "user_123";
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: mockUserId });

    const result = await getCurrentUserId();

    expect(result).toBe(mockUserId);
    expect(auth).toHaveBeenCalledTimes(1);
  });

  it("未認証ユーザーの場合、nullを返す", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({ userId: null });

    const result = await getCurrentUserId();

    expect(result).toBeNull();
    expect(auth).toHaveBeenCalledTimes(1);
  });
});
