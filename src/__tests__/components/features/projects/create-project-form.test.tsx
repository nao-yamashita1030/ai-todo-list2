import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { CreateProjectForm } from "@/components/features/projects/create-project-form";
import { createProject } from "@/app/actions/projects";

// モック
jest.mock("@/app/actions/projects", () => ({
  createProject: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("CreateProjectForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされる", () => {
    render(<CreateProjectForm />);

    expect(screen.getByLabelText(/プロジェクト名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /作成/i })).toBeInTheDocument();
  });

  it("プロジェクトを作成できる", async () => {
    const user = userEvent.setup();
    const mockProject = {
      id: "project_123",
      name: "Test Project",
      description: "Test Description",
    };

    (createProject as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProject,
    });

    render(<CreateProjectForm />);

    const nameInput = screen.getByLabelText(/プロジェクト名/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByRole("button", { name: /作成/i });

    await user.type(nameInput, "Test Project");
    await user.type(descriptionInput, "Test Description");
    await user.click(submitButton);

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: "Test Project",
        description: "Test Description",
      });
    });
  });

  it("エラーが発生した場合、エラーメッセージを表示する", async () => {
    const user = userEvent.setup();

    (createProject as jest.Mock).mockResolvedValue({
      success: false,
      error: "プロジェクトの作成に失敗しました",
    });

    render(<CreateProjectForm />);

    const nameInput = screen.getByLabelText(/プロジェクト名/i);
    const submitButton = screen.getByRole("button", { name: /作成/i });

    await user.type(nameInput, "Test Project");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("プロジェクトの作成に失敗しました")
      ).toBeInTheDocument();
    });
  });

  it("空のプロジェクト名で送信できない", async () => {
    const user = userEvent.setup();

    render(<CreateProjectForm />);

    const submitButton = screen.getByRole("button", { name: /作成/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createProject).not.toHaveBeenCalled();
    });
  });
});
