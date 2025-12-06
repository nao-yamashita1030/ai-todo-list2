import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { CreateTodoForm } from "@/components/features/todos/create-todo-form";
import { createTodo } from "@/app/actions/todos";
import type { Project, Category, Tag } from "@prisma/client";

// モック
jest.mock("@/app/actions/todos", () => ({
  createTodo: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockProjects = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Project 1",
    description: "Test Project",
    categories: [] as Category[],
    tags: [] as Tag[],
  },
] as (Project & { categories: Category[]; tags: Tag[] })[];

describe("CreateTodoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされる", () => {
    render(<CreateTodoForm projects={mockProjects} />);

    expect(screen.getByLabelText(/タイトル/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /作成/i })).toBeInTheDocument();
  });

  it("TODOを作成できる", async () => {
    const user = userEvent.setup();
    const mockTodo = {
      id: "todo_123",
      title: "Test Todo",
      description: "Test Description",
    };

    (createTodo as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTodo,
    });

    render(<CreateTodoForm projects={mockProjects} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByRole("button", { name: /作成/i });

    await user.type(titleInput, "Test Todo");
    await user.type(descriptionInput, "Test Description");
    await user.click(submitButton);

    await waitFor(() => {
      expect(createTodo).toHaveBeenCalled();
    });
  });

  it("エラーが発生した場合、エラーメッセージを表示する", async () => {
    const user = userEvent.setup();

    (createTodo as jest.Mock).mockResolvedValue({
      success: false,
      error: "TODOの作成に失敗しました",
    });

    render(<CreateTodoForm projects={mockProjects} />);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const submitButton = screen.getByRole("button", { name: /作成/i });

    await user.type(titleInput, "Test Todo");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("TODOの作成に失敗しました")).toBeInTheDocument();
    });
  });
});
