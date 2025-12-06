import TodosPage from "@/app/(dashboard)/todos/page";
import { getCurrentUserId } from "@/lib/auth";
import { getTodosByUserId } from "@/dal/todos";
import { redirect } from "next/navigation";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/dal/todos", () => ({
  getTodosByUserId: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/features/todos/todo-list-with-filters", () => ({
  TodoListWithFilters: jest.fn(() => <div>TodoListWithFilters</div>),
}));

describe("TodosPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("認証済みユーザーの場合、TODO一覧を表示する", async () => {
    const userId = "user_123";
    const mockTodos = [
      {
        id: "todo_1",
        title: "Test Todo",
        project: { id: "project_1" },
        category: null,
        creator: { id: userId },
        todoTags: [],
      },
    ];

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodosByUserId as jest.Mock).mockResolvedValue(mockTodos);

    await TodosPage({ searchParams: Promise.resolve({}) });

    expect(getTodosByUserId).toHaveBeenCalledWith(userId, undefined);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("未認証ユーザーの場合、リダイレクトする", async () => {
    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    await TodosPage({ searchParams: Promise.resolve({}) });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("projectIdが指定された場合、そのプロジェクトのTODOのみ取得する", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockTodos = [];

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (getTodosByUserId as jest.Mock).mockResolvedValue(mockTodos);

    await TodosPage({ searchParams: Promise.resolve({ projectId }) });

    expect(getTodosByUserId).toHaveBeenCalledWith(userId, projectId);
  });
});

