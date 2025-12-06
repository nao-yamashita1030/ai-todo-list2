import NewProjectPage from "@/app/(dashboard)/projects/new/page";
import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/features/projects/create-project-form", () => ({
  CreateProjectForm: jest.fn(() => <div>CreateProjectForm</div>),
}));

describe("NewProjectPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーの場合、プロジェクト作成画面を表示する", async () => {
    const userId = "user_123";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);

    await NewProjectPage();

    expect(redirect).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await NewProjectPage();

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});

