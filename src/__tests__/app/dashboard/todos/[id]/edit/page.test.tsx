import EditTodoPage from "@/app/(dashboard)/todos/[id]/edit/page";
import { getCurrentUserId } from "@/lib/auth";
import { getTodoById, isProjectMember } from "@/dal/todos";
import { getProjectById } from "@/dal/projects";
import { redirect, notFound } from "next/navigation";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/dal/todos", () => ({
  getTodoById: jest.fn(),
  isProjectMember: jest.fn(),
}));

jest.mock("@/dal/projects", () => ({
  getProjectById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock("@/components/features/todos/edit-todo-form", () => ({
  EditTodoForm: jest.fn(() => <div>EditTodoForm</div>),
}));

describe("EditTodoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーで作成者の場合、TODO編集画面を表示する", async () => {
    const userId = "user_123";
    const todoId = "todo_1";
    const projectId = "project_1";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      createdBy: userId,
      projectId,
      project: {
        id: projectId,
        ownerId: userId,
      },
      category: null,
      creator: { id: userId },
      todoTags: [],
    };
    const mockProject = {
      id: projectId,
      name: "Project 1",
      ownerId: userId,
      categories: [],
      tags: [],
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(mockTodo);
    (getProjectById as jest.Mock).mockResolvedValue(mockProject);

    await EditTodoPage({ params: Promise.resolve({ id: todoId }) });

    expect(getTodoById).toHaveBeenCalledWith(todoId, userId);
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    const todoId = "todo_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await EditTodoPage({ params: Promise.resolve({ id: todoId }) });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("TODOが見つからない場合、notFoundを呼び出す", async () => {
    const userId = "user_123";
    const todoId = "todo_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(null);

    try {
      await EditTodoPage({ params: Promise.resolve({ id: todoId }) });
    } catch (error) {
      // nullの場合のエラーをキャッチ
    }

    expect(notFound).toHaveBeenCalled();
  });
});

