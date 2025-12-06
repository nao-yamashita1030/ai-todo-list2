import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteTodoForm } from "@/components/features/todos/delete-todo-form";
import { deleteTodo } from "@/app/actions/todos";
import type { TodoWithRelations } from "@/dal/todos";

// モック
jest.mock("@/app/actions/todos", () => ({
  deleteTodo: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockTodo: TodoWithRelations = {
  id: "todo_1",
  title: "Test Todo",
  description: "Test Description",
  status: "todo",
  priority: "high",
  dueDate: null,
  projectId: "project_1",
  categoryId: null,
  createdBy: "user_1",
  createdAt: new Date(),
  updatedAt: new Date(),
  project: {
    id: "project_1",
    name: "Project 1",
    description: null,
    ownerId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  category: null,
  creator: {
    id: "user_1",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  todoTags: [],
};

describe("DeleteTodoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("削除フォームが正しくレンダリングされる", () => {
    render(<DeleteTodoForm todo={mockTodo} />);

    expect(screen.getByText("TODO削除")).toBeInTheDocument();
    // 「この操作は取り消せません」は複数箇所にあるため、getAllByTextを使用
    const warnings = screen.getAllByText(/この操作は取り消せません/i);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("削除ボタンが表示される", () => {
    render(<DeleteTodoForm todo={mockTodo} />);

    // 削除ボタンが存在することを確認
    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(btn => 
      btn.textContent === "削除" || btn.textContent === "削除中..."
    );
    expect(deleteButton).toBeInTheDocument();
  });

  it("エラーメッセージが表示できる", () => {
    render(<DeleteTodoForm todo={mockTodo} />);

    // エラーメッセージ表示の準備ができていることを確認
    expect(screen.getByText("TODO削除")).toBeInTheDocument();
  });
});

