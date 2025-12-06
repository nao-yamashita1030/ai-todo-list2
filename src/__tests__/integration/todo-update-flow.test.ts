/**
 * 結合テスト: TODO更新フロー
 * 
 * テストシナリオ:
 * 1. TODOを作成
 * 2. TODOを更新
 * 3. TODO一覧に更新されたTODOが表示される
 * 4. 変更履歴に更新履歴が記録される
 */

import { createTodo, updateTodo } from "@/app/actions/todos";
import { getTodosByUserId } from "@/dal/todos";
import { hasProjectAccess } from "@/dal/projects";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
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
  hasProjectAccess: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("結合テスト: TODO更新フロー", () => {
  const userId = "user_123";
  const projectId = "00000000-0000-0000-0000-000000000001";
  let todoId: string;

  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (hasProjectAccess as jest.Mock).mockResolvedValue(true);

    const mockProject = {
      id: projectId,
      ownerId: userId,
    };
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);
  });

  it("シナリオ2: TODO作成 → TODO更新 → TODO一覧表示 → 変更履歴確認", async () => {
    // 1. TODOを作成
    todoId = "todo_123";
    const mockTodo = {
      id: todoId,
      title: "Original Todo",
      description: "Original Description",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.todo.create as jest.Mock).mockResolvedValue({
      ...mockTodo,
      project: {
        id: projectId,
        ownerId: userId,
      },
      category: null,
      creator: { id: userId },
    });
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const createResult = await createTodo({
      title: "Original Todo",
      description: "Original Description",
      status: "todo",
      priority: "high",
      projectId,
    });

    expect(createResult.success).toBe(true);

    // 2. TODOを更新
    const updatedTodo = {
      ...mockTodo,
      title: "Updated Todo",
      description: "Updated Description",
      status: "in_progress" as const,
      priority: "medium" as const,
    };

    (prisma.todo.findFirst as jest.Mock).mockResolvedValue({
      ...mockTodo,
      project: {
        id: projectId,
        ownerId: userId,
      },
    });
    (prisma.todo.update as jest.Mock).mockResolvedValue(updatedTodo);
    (prisma.history.create as jest.Mock).mockResolvedValue({
      id: "history_1",
      todoId,
      userId,
      action: "updated",
      createdAt: new Date(),
    });

    const updateResult = await updateTodo(todoId, {
      title: "Updated Todo",
      description: "Updated Description",
      status: "in_progress",
      priority: "medium",
    });

    expect(updateResult.success).toBe(true);
    if (updateResult.success && updateResult.data) {
      expect(updateResult.data.title).toBe("Updated Todo");
      expect(updateResult.data.status).toBe("in_progress");
    }

    // 3. TODO一覧に更新されたTODOが表示される
    (prisma.project.findMany as jest.Mock).mockResolvedValue([
      {
        id: projectId,
        ownerId: userId,
      },
    ]);
    (prisma.todo.findMany as jest.Mock).mockResolvedValue([updatedTodo]);

    const todos = await getTodosByUserId(userId);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0].title).toBe("Updated Todo");
    expect(todos[0].status).toBe("in_progress");

    // 4. 変更履歴に更新履歴が記録される（status_changedアクションが呼ばれる）
    expect(prisma.history.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          todoId,
          userId,
          action: "status_changed",
        }),
      })
    );
  });
});

