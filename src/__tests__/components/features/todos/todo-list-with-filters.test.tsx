import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoListWithFilters } from "@/components/features/todos/todo-list-with-filters";
import type { TodoWithRelations } from "@/dal/todos";

// モック
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockTodos: TodoWithRelations[] = [
  {
    id: "todo_1",
    title: "Test Todo 1",
    description: "Description 1",
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
  },
  {
    id: "todo_2",
    title: "Test Todo 2",
    description: "Description 2",
    status: "in_progress",
    priority: "medium",
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
  },
];

describe("TodoListWithFilters", () => {
  it("TODO一覧が正しくレンダリングされる", () => {
    render(<TodoListWithFilters todos={mockTodos} />);

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("検索機能が動作する", async () => {
    const user = userEvent.setup();
    render(<TodoListWithFilters todos={mockTodos} />);

    const searchInput = screen.getByPlaceholderText(/検索/i);
    await user.type(searchInput, "Todo 1");

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Todo 2")).not.toBeInTheDocument();
  });

  it("ステータスフィルタボタンが表示される", () => {
    render(<TodoListWithFilters todos={mockTodos} />);

    // ステータスフィルタボタンが表示されることを確認
    const statusFilterButtons = screen.getAllByLabelText(/ステータスでフィルタリング/i);
    expect(statusFilterButtons.length).toBeGreaterThan(0);
  });

  it("空のTODO一覧を表示できる", () => {
    render(<TodoListWithFilters todos={[]} />);

    expect(screen.getByText(/TODOがありません/i)).toBeInTheDocument();
  });

  it("優先度フィルタが動作する", async () => {
    const user = userEvent.setup();
    render(<TodoListWithFilters todos={mockTodos} />);

    // 優先度フィルタボタンが表示されることを確認
    const priorityFilterButtons = screen.getAllByLabelText(/優先度でフィルタリング/i);
    expect(priorityFilterButtons.length).toBeGreaterThan(0);
  });

  it("説明での検索が動作する", async () => {
    const user = userEvent.setup();
    render(<TodoListWithFilters todos={mockTodos} />);

    const searchInput = screen.getByPlaceholderText(/検索/i);
    await user.type(searchInput, "Description 1");

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.queryByText("Test Todo 2")).not.toBeInTheDocument();
  });
});

