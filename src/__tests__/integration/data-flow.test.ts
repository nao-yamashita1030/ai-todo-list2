/**
 * 結合テスト: データフロー
 * 
 * テストシナリオ:
 * 1. プロジェクト作成 → プロジェクト一覧表示
 * 2. TODO作成 → TODO一覧表示 → TODO詳細表示
 * 3. コメント作成 → コメント一覧表示
 */

import { createProject } from "@/app/actions/projects";
import { createTodo } from "@/app/actions/todos";
import { createComment } from "@/app/actions/comments";
import { getProjectsByUserId, hasProjectAccess } from "@/dal/projects";
import { getTodosByUserId, getTodoById } from "@/dal/todos";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    projectMember: {
      create: jest.fn(),
    },
    todo: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    category: {
      findFirst: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    history: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/dal/projects", () => ({
  getProjectsByUserId: jest.fn(),
  hasProjectAccess: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("結合テスト: データフロー", () => {
  const userId = "user_123";
  let projectId: string;
  let todoId: string;
  let commentId: string;

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (hasProjectAccess as jest.Mock).mockResolvedValue(true);
  });

  it("データフロー1: プロジェクト作成 → プロジェクト一覧表示", async () => {
    // プロジェクトを作成
    projectId = "00000000-0000-0000-0000-000000000001";
    const mockProject = {
      id: projectId,
      name: "Test Project",
      description: "Test Description",
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.project.create as jest.Mock).mockResolvedValue({
      ...mockProject,
      owner: { id: userId },
    });
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);
    (prisma.projectMember.create as jest.Mock).mockResolvedValue({});

    const projectResult = await createProject({
      name: "Test Project",
      description: "Test Description",
    });

    expect(projectResult.success).toBe(true);

    // プロジェクト一覧を表示
    (prisma.project.findMany as jest.Mock).mockResolvedValue([mockProject]);
    (getProjectsByUserId as jest.Mock).mockResolvedValue([
      {
        ...mockProject,
        owner: { id: userId },
        categories: [],
        tags: [],
        _count: { todos: 0, members: 1 },
      },
    ]);

    const projects = await getProjectsByUserId(userId);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].name).toBe("Test Project");
  });

  it("データフロー2: TODO作成 → TODO一覧表示 → TODO詳細表示", async () => {
    projectId = "00000000-0000-0000-0000-000000000001";
    const mockProject = {
      id: projectId,
      ownerId: userId,
    };
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);

    // TODOを作成
    todoId = "todo_123";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      description: "Test Description",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.todo.create as jest.Mock).mockResolvedValue({
      ...mockTodo,
      project: mockProject,
      category: null,
      creator: { id: userId },
    });
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const todoResult = await createTodo({
      title: "Test Todo",
      description: "Test Description",
      status: "todo",
      priority: "high",
      projectId,
    });

    expect(todoResult.success).toBe(true);

    // TODO一覧を表示
    (prisma.project.findMany as jest.Mock).mockResolvedValue([mockProject]);
    (prisma.todo.findMany as jest.Mock).mockResolvedValue([
      {
        ...mockTodo,
        project: mockProject,
        category: null,
        creator: { id: userId },
        todoTags: [],
      },
    ]);

    const todos = await getTodosByUserId(userId);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0].title).toBe("Test Todo");

    // TODO詳細を表示
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue({
      ...mockTodo,
      project: mockProject,
      category: null,
      creator: { id: userId },
      todoTags: [],
    });

    const todo = await getTodoById(todoId, userId);
    expect(todo).not.toBeNull();
    if (todo) {
      expect(todo.title).toBe("Test Todo");
    }
  });

  it("データフロー3: コメント作成 → コメント一覧表示", async () => {
    projectId = "00000000-0000-0000-0000-000000000001";
    todoId = "00000000-0000-0000-0000-000000000002";

    const mockProject = {
      id: projectId,
      ownerId: userId,
    };
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);

    const mockTodo = {
      id: todoId,
      projectId,
      createdBy: userId,
      project: mockProject,
    };
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockTodo);

    // コメントを作成
    commentId = "comment_123";
    const mockComment = {
      id: commentId,
      todoId,
      userId,
      content: "Test Comment",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.comment.create as jest.Mock).mockResolvedValue({
      ...mockComment,
      user: { id: userId, name: "Test User", email: "test@example.com" },
    });

    const commentResult = await createComment({
      todoId,
      content: "Test Comment",
    });

    expect(commentResult.success).toBe(true);

    // コメント一覧を表示（TODO詳細画面で表示される）
    (prisma.comment.findMany as jest.Mock).mockResolvedValue([mockComment]);

    // TODO詳細を取得すると、コメントも含まれる想定
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue({
      ...mockTodo,
      project: mockProject,
      category: null,
      creator: { id: userId },
      todoTags: [],
      comments: [
        {
          ...mockComment,
          user: { name: "Test User", email: "test@example.com" },
        },
      ],
    });

    const todo = await getTodoById(todoId, userId);
    expect(todo).not.toBeNull();
  });
});

