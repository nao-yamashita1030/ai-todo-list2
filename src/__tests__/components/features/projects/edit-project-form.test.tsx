import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditProjectForm } from "@/components/features/projects/edit-project-form";
import { updateProject } from "@/app/actions/projects";
import type { Project } from "@prisma/client";

// モック
jest.mock("@/app/actions/projects", () => ({
  updateProject: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockProject: Project = {
  id: "project_1",
  name: "Original Project",
  description: "Original Description",
  ownerId: "user_1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("EditProjectForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされる", () => {
    render(<EditProjectForm project={mockProject} />);

    expect(screen.getByDisplayValue("Original Project")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Original Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新/i })).toBeInTheDocument();
  });

  it("プロジェクトを更新できる", async () => {
    const user = userEvent.setup();
    const updatedProject = {
      ...mockProject,
      name: "Updated Project",
    };

    (updateProject as jest.Mock).mockResolvedValue({
      success: true,
      data: updatedProject,
    });

    render(<EditProjectForm project={mockProject} />);

    const nameInput = screen.getByDisplayValue("Original Project");
    const submitButton = screen.getByRole("button", { name: /更新/i });

    await user.clear(nameInput);
    await user.type(nameInput, "Updated Project");
    await user.click(submitButton);

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalled();
    });
  });

  it("エラーが発生した場合、エラーメッセージを表示する", async () => {
    const user = userEvent.setup();

    (updateProject as jest.Mock).mockResolvedValue({
      success: false,
      error: "プロジェクトの更新に失敗しました",
    });

    render(<EditProjectForm project={mockProject} />);

    const submitButton = screen.getByRole("button", { name: /更新/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("プロジェクトの更新に失敗しました")).toBeInTheDocument();
    });
  });
});

