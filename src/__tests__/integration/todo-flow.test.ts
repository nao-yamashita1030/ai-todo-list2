/**
 * 結合テスト: TODO作成から表示までのフロー
 * 
 * テストシナリオ:
 * 1. プロジェクトを作成
 * 2. TODOを作成
 * 3. TODO一覧に作成したTODOが表示される
 * 4. TODO詳細画面でTODOの内容が正しく表示される
 */

import { createProject } from "@/app/actions/projects";
import { createTodo } from "@/app/actions/todos";
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
    history: {
      create: jest.fn(),
    },
  },
}));

jest.mock("@/dal/projects", () => ({
  hasProjectAccess: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("結合テスト: TODO作成から表示までのフロー", () => {
  const userId = "user_123";
  let projectId: string;
  let todoId: string;

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (hasProjectAccess as jest.Mock).mockResolvedValue(true);
  });

  it("シナリオ1: プロジェクト作成 → TODO作成 → TODO一覧表示 → TODO詳細表示", async () => {
    // 1. プロジェクトを作成
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
    if (projectResult.success && projectResult.data) {
      expect(projectResult.data.name).toBe("Test Project");
    }

    // 2. TODOを作成
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

    if (!todoResult.success) {
      console.error("TODO作成エラー:", todoResult.error, todoResult.details);
    }
    expect(todoResult.success).toBe(true);
    if (todoResult.success && todoResult.data) {
      expect(todoResult.data.title).toBe("Test Todo");
    }

    // 3. TODO一覧に作成したTODOが表示される
    const mockTodos = [mockTodo];
    (prisma.project.findMany as jest.Mock).mockResolvedValue([mockProject]);
    (prisma.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

    const todos = await getTodosByUserId(userId);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0].title).toBe("Test Todo");

    // 4. TODO詳細画面でTODOの内容が正しく表示される
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
      expect(todo.description).toBe("Test Description");
    }
  });
});

