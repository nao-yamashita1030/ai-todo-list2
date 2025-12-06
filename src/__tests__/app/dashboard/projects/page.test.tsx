import ProjectsPage from "@/app/(dashboard)/projects/page";
import { getCurrentUserId } from "@/lib/auth";
import { getProjectsByUserId } from "@/dal/projects";
import { redirect } from "next/navigation";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/dal/projects", () => ({
  getProjectsByUserId: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/features/projects/project-list-with-search", () => ({
  ProjectListWithSearch: jest.fn(() => <div>ProjectListWithSearch</div>),
}));

describe("ProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーの場合、プロジェクト一覧を表示する", async () => {
    const userId = "user_123";
    const mockProjects = [
      {
        id: "project_1",
        name: "Project 1",
        owner: { id: userId },
        categories: [],
        tags: [],
        _count: { todos: 0, members: 1 },
      },
    ];

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getProjectsByUserId as jest.Mock).mockResolvedValue(mockProjects);

    await ProjectsPage();

    expect(getProjectsByUserId).toHaveBeenCalledWith(userId);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await ProjectsPage();

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});

