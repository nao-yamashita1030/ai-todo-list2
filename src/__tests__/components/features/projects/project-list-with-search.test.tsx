import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectListWithSearch } from "@/components/features/projects/project-list-with-search";
import type { Project } from "@prisma/client";

// モック
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockProjects = [
  {
    id: "project_1",
    name: "Project 1",
    description: "Description 1",
    ownerId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: "user_1",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    categories: [],
    tags: [],
    _count: {
      todos: 5,
      members: 2,
    },
  },
  {
    id: "project_2",
    name: "Project 2",
    description: "Description 2",
    ownerId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: "user_1",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    categories: [],
    tags: [],
    _count: {
      todos: 3,
      members: 1,
    },
  },
] as Project[];

describe("ProjectListWithSearch", () => {
  it("プロジェクト一覧が正しくレンダリングされる", () => {
    render(<ProjectListWithSearch projects={mockProjects} userId="user_1" />);

    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
  });

  it("検索機能が動作する", async () => {
    const user = userEvent.setup();
    render(<ProjectListWithSearch projects={mockProjects} userId="user_1" />);

    const searchInput = screen.getByPlaceholderText(/検索/i);
    await user.type(searchInput, "Project 1");

    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.queryByText("Project 2")).not.toBeInTheDocument();
  });

  it("空のプロジェクト一覧を表示できる", () => {
    render(<ProjectListWithSearch projects={[]} userId="user_1" />);

    expect(screen.getByText(/プロジェクトがありません/i)).toBeInTheDocument();
  });
});

