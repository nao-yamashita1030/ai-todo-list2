import EditProjectPage from "@/app/(dashboard)/projects/[id]/edit/page";
import { getCurrentUserId } from "@/lib/auth";
import { getProjectById } from "@/dal/projects";
import { redirect, notFound } from "next/navigation";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/dal/projects", () => ({
  getProjectById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock("@/components/features/projects/edit-project-form", () => ({
  EditProjectForm: jest.fn(() => <div>EditProjectForm</div>),
}));

describe("EditProjectPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーでオーナーの場合、プロジェクト編集画面を表示する", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockProject = {
      id: projectId,
      name: "Project 1",
      ownerId: userId,
      owner: { id: userId },
      members: [],
      categories: [],
      tags: [],
      _count: { todos: 0 },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getProjectById as jest.Mock).mockResolvedValue(mockProject);

    await EditProjectPage({ params: Promise.resolve({ id: projectId }) });

    expect(getProjectById).toHaveBeenCalledWith(projectId, userId);
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    const projectId = "project_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await EditProjectPage({ params: Promise.resolve({ id: projectId }) });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("プロジェクトが見つからない場合、notFoundを呼び出す", async () => {
    const userId = "user_123";
    const projectId = "project_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getProjectById as jest.Mock).mockResolvedValue(null);

    try {
      await EditProjectPage({ params: Promise.resolve({ id: projectId }) });
    } catch (error) {
      // nullの場合のエラーをキャッチ
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("オーナーでない場合、リダイレクトする", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockProject = {
      id: projectId,
      name: "Project 1",
      ownerId: "other_user",
      owner: { id: "other_user" },
      members: [],
      categories: [],
      tags: [],
      _count: { todos: 0 },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getProjectById as jest.Mock).mockResolvedValue(mockProject);

    await EditProjectPage({ params: Promise.resolve({ id: projectId }) });

    expect(redirect).toHaveBeenCalledWith("/projects");
  });
});

