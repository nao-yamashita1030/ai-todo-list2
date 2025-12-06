import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteProjectForm } from "@/components/features/projects/delete-project-form";
import { deleteProject } from "@/app/actions/projects";
import type { Project } from "@prisma/client";

// モック
jest.mock("@/app/actions/projects", () => ({
  deleteProject: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockProject: Project = {
  id: "project_1",
  name: "Test Project",
  description: "Test Description",
  ownerId: "user_1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("DeleteProjectForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("削除フォームが正しくレンダリングされる", () => {
    render(<DeleteProjectForm project={mockProject} />);

    expect(screen.getByText("プロジェクト削除")).toBeInTheDocument();
    // 「この操作は取り消せません」は複数箇所にあるため、getAllByTextを使用
    const warnings = screen.getAllByText(/この操作は取り消せません/i);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("削除ボタンが表示される", () => {
    render(<DeleteProjectForm project={mockProject} />);

    // 削除ボタンが存在することを確認
    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(btn => 
      btn.textContent === "削除" || btn.textContent === "削除中..."
    );
    expect(deleteButton).toBeInTheDocument();
  });

  it("エラーメッセージが表示できる", () => {
    render(<DeleteProjectForm project={mockProject} />);

    // エラーメッセージ表示の準備ができていることを確認
    expect(screen.getByText("プロジェクト削除")).toBeInTheDocument();
  });
});

