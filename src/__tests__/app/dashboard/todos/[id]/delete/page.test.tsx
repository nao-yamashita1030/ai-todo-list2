import DeleteTodoPage from "@/app/(dashboard)/todos/[id]/delete/page";
import { getCurrentUserId } from "@/lib/auth";
import { getTodoById } from "@/dal/todos";
import { redirect, notFound } from "next/navigation";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/dal/todos", () => ({
  getTodoById: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock("@/components/features/todos/delete-todo-form", () => ({
  DeleteTodoForm: jest.fn(() => <div>DeleteTodoForm</div>),
}));

describe("DeleteTodoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーで作成者の場合、削除画面を表示する", async () => {
    const userId = "user_123";
    const todoId = "todo_1";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      createdBy: userId,
      project: {
        id: "project_1",
        ownerId: userId,
      },
      category: null,
      creator: { id: userId },
      todoTags: [],
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(mockTodo);

    await DeleteTodoPage({ params: Promise.resolve({ id: todoId }) });

    expect(getTodoById).toHaveBeenCalledWith(todoId, userId);
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    const todoId = "todo_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await DeleteTodoPage({ params: Promise.resolve({ id: todoId }) });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("TODOが見つからない場合、notFoundを呼び出す", async () => {
    const userId = "user_123";
    const todoId = "todo_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(null);

    try {
      await DeleteTodoPage({ params: Promise.resolve({ id: todoId }) });
    } catch (error) {
      // nullの場合のエラーをキャッチ
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("削除権限がない場合、リダイレクトする", async () => {
    const userId = "user_123";
    const todoId = "todo_1";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      createdBy: "other_user",
      project: {
        id: "project_1",
        ownerId: "other_user",
      },
      category: null,
      creator: { id: "other_user" },
      todoTags: [],
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(mockTodo);

    await DeleteTodoPage({ params: Promise.resolve({ id: todoId }) });

    expect(redirect).toHaveBeenCalledWith(`/todos/${todoId}`);
  });
});

