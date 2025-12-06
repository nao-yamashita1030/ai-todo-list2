import DashboardLayout from "@/app/(dashboard)/layout";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/auth";
import { redirect } from "next/navigation";

// モック
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  syncUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("DashboardLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーの場合、レイアウトを表示する", async () => {
    const userId = "user_123";

    (auth as jest.Mock).mockResolvedValue({ userId });
    (syncUser as jest.Mock).mockResolvedValue(undefined);

    const layout = await DashboardLayout({ children: <div>Test</div> });

    expect(syncUser).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: null });

    await DashboardLayout({ children: <div>Test</div> });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});

