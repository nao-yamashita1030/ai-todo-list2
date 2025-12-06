/**
 * 結合テスト: プロジェクト共有フロー
 * 
 * テストシナリオ:
 * 1. プロジェクトオーナーがプロジェクトを作成
 * 2. プロジェクトにメンバーを追加（将来実装予定の機能のため、現在はスキップ）
 * 3. メンバーがプロジェクトのTODOを閲覧できる
 * 4. メンバーがTODOを作成できる
 * 5. メンバーがTODOを編集できる
 */

import { createProject } from "@/app/actions/projects";
import { createTodo, updateTodo } from "@/app/actions/todos";
import { getProjectsByUserId, hasProjectAccess } from "@/dal/projects";
import { getTodosByUserId } from "@/dal/todos";
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
      findFirst: jest.fn(),
    },
    todo: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
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
  getProjectsByUserId: jest.fn(),
  hasProjectAccess: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("結合テスト: プロジェクト共有フロー", () => {
  const ownerId = "owner_123";
  const memberId = "member_123";
  const projectId = "00000000-0000-0000-0000-000000000001";
  let todoId: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("シナリオ3: プロジェクト作成 → TODO作成 → メンバーがTODOを閲覧・作成・編集", async () => {
    // 1. プロジェクトオーナーがプロジェクトを作成
    (getCurrentUserId as jest.Mock).mockResolvedValue(ownerId);

    const mockProject = {
      id: projectId,
      name: "Shared Project",
      description: "Test Description",
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.project.create as jest.Mock).mockResolvedValue({
      ...mockProject,
      owner: { id: ownerId },
    });
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);
    (prisma.projectMember.create as jest.Mock).mockResolvedValue({});
    (hasProjectAccess as jest.Mock).mockResolvedValue(true);

    const projectResult = await createProject({
      name: "Shared Project",
      description: "Test Description",
    });

    expect(projectResult.success).toBe(true);

    // 2. オーナーがTODOを作成
    todoId = "todo_123";
    const mockTodo = {
      id: todoId,
      title: "Owner's Todo",
      description: "Created by owner",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.todo.create as jest.Mock).mockResolvedValue({
      ...mockTodo,
      project: mockProject,
      category: null,
      creator: { id: ownerId },
    });
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const todoResult = await createTodo({
      title: "Owner's Todo",
      description: "Created by owner",
      status: "todo",
      priority: "high",
      projectId,
    });

    expect(todoResult.success).toBe(true);

    // 3. メンバーがプロジェクトのTODOを閲覧できる
    (getCurrentUserId as jest.Mock).mockResolvedValue(memberId);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);
    (prisma.projectMember.findFirst as jest.Mock).mockResolvedValue({
      id: "member_1",
      projectId,
      userId: memberId,
    });
    (prisma.project.findMany as jest.Mock).mockResolvedValue([mockProject]);
    (prisma.todo.findMany as jest.Mock).mockResolvedValue([mockTodo]);

    const todos = await getTodosByUserId(memberId, projectId);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0].title).toBe("Owner's Todo");

    // 4. メンバーがTODOを作成できる
    const memberTodoId = "todo_456";
    const memberTodo = {
      id: memberTodoId,
      title: "Member's Todo",
      description: "Created by member",
      status: "todo" as const,
      priority: "medium" as const,
      projectId,
      createdBy: memberId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.todo.create as jest.Mock).mockResolvedValue({
      ...memberTodo,
      project: mockProject,
      category: null,
      creator: { id: memberId },
    });
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const memberTodoResult = await createTodo({
      title: "Member's Todo",
      description: "Created by member",
      status: "todo",
      priority: "medium",
      projectId,
    });

    expect(memberTodoResult.success).toBe(true);

    // 5. メンバーがTODOを編集できる
    const updatedMemberTodo = {
      ...memberTodo,
      title: "Updated Member's Todo",
      status: "in_progress" as const,
    };

    (prisma.todo.findFirst as jest.Mock).mockResolvedValue({
      ...memberTodo,
      project: {
        id: projectId,
        ownerId,
      },
    });
    (prisma.todo.update as jest.Mock).mockResolvedValue(updatedMemberTodo);
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const updateResult = await updateTodo(memberTodoId, {
      title: "Updated Member's Todo",
      status: "in_progress",
    });

    expect(updateResult.success).toBe(true);
    if (updateResult.success && updateResult.data) {
      expect(updateResult.data.title).toBe("Updated Member's Todo");
      expect(updateResult.data.status).toBe("in_progress");
    }
  });
});

