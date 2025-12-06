import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditTodoForm } from "@/components/features/todos/edit-todo-form";
import { updateTodo } from "@/app/actions/todos";
import type { TodoWithRelations } from "@/dal/todos";
import type { Project, Category, Tag } from "@prisma/client";

type ProjectWithRelations = Project & {
  categories: Category[];
  tags: Tag[];
};

// モック
jest.mock("@/app/actions/todos", () => ({
  updateTodo: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockTodo: TodoWithRelations = {
  id: "todo_1",
  title: "Original Todo",
  description: "Original Description",
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

const mockProjects = [
  {
    id: "project_1",
    name: "Project 1",
    description: "Test Project",
    categories: [] as Category[],
    tags: [] as Tag[],
  },
] as (Project & { categories: Category[]; tags: Tag[] })[];

describe("EditTodoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされる", () => {
    const mockProject = {
      id: "project_1",
      name: "Project 1",
      description: "Test Project",
      categories: [] as Category[],
      tags: [] as Tag[],
    } as ProjectWithRelations;
    render(<EditTodoForm todo={mockTodo} project={mockProject} />);

    expect(screen.getByDisplayValue("Original Todo")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Original Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });

  it("TODOを更新できる", async () => {
    const user = userEvent.setup();
    const updatedTodo = {
      ...mockTodo,
      title: "Updated Todo",
    };

    (updateTodo as jest.Mock).mockResolvedValue({
      success: true,
      data: updatedTodo,
    });

    const mockProject = {
      id: "project_1",
      name: "Project 1",
      description: "Test Project",
      categories: [] as Category[],
      tags: [] as Tag[],
    } as ProjectWithRelations;
    render(<EditTodoForm todo={mockTodo} project={mockProject} />);

    const titleInput = screen.getByDisplayValue("Original Todo");
    const submitButton = screen.getByRole("button", { name: /更新/i });

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Todo");
    await user.click(submitButton);

    await waitFor(() => {
      expect(updateTodo).toHaveBeenCalled();
    });
  });

  it("エラーが発生した場合、エラーメッセージを表示する", async () => {
    const user = userEvent.setup();

    (updateTodo as jest.Mock).mockResolvedValue({
      success: false,
      error: "TODOの更新に失敗しました",
    });

    const mockProject = {
      id: "project_1",
      name: "Project 1",
      description: "Test Project",
      categories: [] as Category[],
      tags: [] as Tag[],
    } as ProjectWithRelations;
    render(<EditTodoForm todo={mockTodo} project={mockProject} />);

    const submitButton = screen.getByRole("button", { name: /更新/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("TODOの更新に失敗しました")).toBeInTheDocument();
    });
  });
});

