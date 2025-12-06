import { createTodo, updateTodo, deleteTodo } from "@/app/actions/todos";
import { getCurrentUserId } from "@/lib/auth";
import { hasProjectAccess } from "@/dal/projects";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// モック（Clerkのモジュールをモック化）
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
  syncUser: jest.fn(),
}));

jest.mock("@/dal/projects", () => ({
  hasProjectAccess: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      findFirst: jest.fn(),
    },
    tag: {
      findMany: jest.fn(),
    },
    todo: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    history: {
      create: jest.fn(),
    },
    projectMember: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("createTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: 有効なデータでTODOが作成される", async () => {
    const userId = "user_123";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const input = {
      title: "Test Todo",
      description: "Test Description",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
    };

    const mockTodo = {
      id: "todo_123",
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      projectId,
      createdBy: userId,
      project: { id: projectId },
      category: null,
      creator: { id: userId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (hasProjectAccess as jest.Mock).mockResolvedValue(true);
    (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.tag.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.todo.create as jest.Mock).mockResolvedValue(mockTodo);
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const result = await createTodo(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockTodo);
    }
    expect(prisma.todo.create).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/todos");
  });

  it("異常系: 認証エラーが発生する", async () => {
    const input = {
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    const result = await createTodo(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("認証が必要です");
    expect(prisma.todo.create).not.toHaveBeenCalled();
  });

  it("異常系: プロジェクトへのアクセス権限がない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const input = {
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (hasProjectAccess as jest.Mock).mockResolvedValue(false);

    const result = await createTodo(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("このプロジェクトにアクセスする権限がありません");
    expect(prisma.todo.create).not.toHaveBeenCalled();
  });

  it("異常系: バリデーションエラーが発生する", async () => {
    const userId = "user_123";
    const input = {
      title: "", // 空のタイトル
      status: "todo" as const,
      priority: "high" as const,
      projectId: "project_123",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);

    const result = await createTodo(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("入力データが不正です");
    expect(prisma.todo.create).not.toHaveBeenCalled();
  });
});

describe("updateTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: 有効なデータでTODOが更新される", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const input = {
      title: "Updated Todo",
      status: "in_progress" as const,
      priority: "medium" as const,
    };

    const mockExistingTodo = {
      id: todoId,
      title: "Original Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: userId,
      project: {
        id: projectId,
        ownerId: userId,
      },
    };

    const mockUpdatedTodo = {
      ...mockExistingTodo,
      ...input,
      project: mockExistingTodo.project,
      category: null,
      creator: { id: userId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockExistingTodo);
    (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.tag.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.todo.update as jest.Mock).mockResolvedValue(mockUpdatedTodo);
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const result = await updateTodo(todoId, input);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.title).toBe("Updated Todo");
    }
    expect(prisma.todo.update).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/todos");
  });

  it("異常系: TODOが見つからない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const input = {
      title: "Updated Todo",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await updateTodo(todoId, input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("TODOが見つかりません");
    expect(prisma.todo.update).not.toHaveBeenCalled();
  });

  it("異常系: カテゴリが存在しない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const categoryId = "123e4567-e89b-12d3-a456-426614174002";
    const input = {
      title: "Updated Todo",
      categoryId,
    };

    const mockExistingTodo = {
      id: todoId,
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: userId,
      project: {
        id: projectId,
        ownerId: userId,
      },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockExistingTodo);
    (prisma.category.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await updateTodo(todoId, input);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "指定されたカテゴリが見つからないか、このプロジェクトに属していません"
    );
    expect(prisma.todo.update).not.toHaveBeenCalled();
  });

  it("異常系: タグが存在しない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const tagIds = ["123e4567-e89b-12d3-a456-426614174003"];
    const input = {
      title: "Updated Todo",
      tagIds,
    };

    const mockExistingTodo = {
      id: todoId,
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: userId,
      project: {
        id: projectId,
        ownerId: userId,
      },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockExistingTodo);
    (prisma.tag.findMany as jest.Mock).mockResolvedValue([]); // タグが見つからない

    const result = await updateTodo(todoId, input);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "指定されたタグが見つからないか、このプロジェクトに属していません"
    );
    expect(prisma.todo.update).not.toHaveBeenCalled();
  });

  it("正常系: プロジェクトメンバーがTODOを更新できる", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const ownerId = "other_user";
    const input = {
      title: "Updated Todo",
    };

    const mockExistingTodo = {
      id: todoId,
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: "other_user", // 別のユーザーが作成
      project: {
        id: projectId,
        ownerId, // 別のユーザーがオーナー
      },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockExistingTodo);
    (prisma.projectMember.findFirst as jest.Mock).mockResolvedValue({
      id: "member_1",
      projectId,
      userId,
    });
    (prisma.todo.update as jest.Mock).mockResolvedValue({
      id: todoId,
      ...input,
    });
    (prisma.history.create as jest.Mock).mockResolvedValue({});

    const result = await updateTodo(todoId, input);

    expect(result.success).toBe(true);
    expect(prisma.todo.update).toHaveBeenCalled();
  });
});

describe("deleteTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: TODOが削除される", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";

    const mockExistingTodo = {
      id: todoId,
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: userId,
      project: {
        id: projectId,
        ownerId: userId,
      },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockExistingTodo);
    (prisma.history.create as jest.Mock).mockResolvedValue({});
    (prisma.todo.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteTodo(todoId);

    expect(result.success).toBe(true);
    expect(prisma.todo.delete).toHaveBeenCalledWith({
      where: { id: todoId },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/todos");
  });

  it("異常系: 削除権限がない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";

    const mockExistingTodo = {
      id: todoId,
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId,
      createdBy: "other_user", // 別のユーザーが作成
      project: {
        id: projectId,
        ownerId: "other_user", // 別のユーザーがオーナー
      },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockExistingTodo);

    const result = await deleteTodo(todoId);

    expect(result.success).toBe(false);
    expect(result.error).toBe("このTODOを削除する権限がありません");
    expect(prisma.todo.delete).not.toHaveBeenCalled();
  });
});
