import NewTodoPage from "@/app/(dashboard)/todos/new/page";
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

jest.mock("@/components/features/todos/create-todo-form", () => ({
  CreateTodoForm: jest.fn(() => <div>CreateTodoForm</div>),
}));

describe("NewTodoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーでプロジェクトがある場合、TODO作成画面を表示する", async () => {
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

    await NewTodoPage();

    expect(getProjectsByUserId).toHaveBeenCalledWith(userId);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await NewTodoPage();

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("プロジェクトがない場合、プロジェクト作成画面にリダイレクトする", async () => {
    const userId = "user_123";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getProjectsByUserId as jest.Mock).mockResolvedValue([]);

    await NewTodoPage();

    expect(redirect).toHaveBeenCalledWith("/projects/new?redirect=/todos/new");
  });
});

