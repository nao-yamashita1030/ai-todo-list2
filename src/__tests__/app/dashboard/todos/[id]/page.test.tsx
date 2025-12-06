import TodoDetailPage from "@/app/(dashboard)/todos/[id]/page";
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

jest.mock("@/components/features/todos/todo-detail", () => ({
  TodoDetail: jest.fn(() => <div>TodoDetail</div>),
}));

describe("TodoDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーの場合、TODO詳細を表示する", async () => {
    const userId = "user_123";
    const todoId = "todo_1";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      project: { id: "project_1" },
      category: null,
      creator: { id: userId },
      todoTags: [],
      comments: [],
      histories: [],
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(mockTodo);

    await TodoDetailPage({ params: Promise.resolve({ id: todoId }) });

    expect(getTodoById).toHaveBeenCalledWith(todoId, userId);
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    const todoId = "todo_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await TodoDetailPage({ params: Promise.resolve({ id: todoId }) });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("TODOが見つからない場合、notFoundを呼び出す", async () => {
    const userId = "user_123";
    const todoId = "todo_1";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodoById as jest.Mock).mockResolvedValue(null);

    await TodoDetailPage({ params: Promise.resolve({ id: todoId }) });

    expect(notFound).toHaveBeenCalled();
  });
});

