import {
  createComment,
  updateComment,
  deleteComment,
} from "@/app/actions/comments";
import { getCurrentUserId } from "@/lib/auth";
import { hasProjectAccess } from "@/dal/projects";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
  syncUser: jest.fn(),
}));

jest.mock("@/dal/projects", () => ({
  hasProjectAccess: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    todo: {
      findFirst: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("createComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: 有効なデータでコメントが作成される", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const input = {
      todoId,
      content: "Test Comment",
    };

    const mockTodo = {
      id: todoId,
      projectId,
      project: { id: projectId },
    };

    const mockComment = {
      id: "comment_123",
      todoId,
      userId,
      content: input.content,
      user: { id: userId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockTodo);
    (hasProjectAccess as jest.Mock).mockResolvedValue(true);
    (prisma.comment.create as jest.Mock).mockResolvedValue(mockComment);

    const result = await createComment(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockComment);
    }
    expect(prisma.comment.create).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith(`/todos/${todoId}`);
  });

  it("異常系: 認証エラーが発生する", async () => {
    const input = {
      todoId: "123e4567-e89b-12d3-a456-426614174001",
      content: "Test Comment",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    const result = await createComment(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("認証が必要です");
    expect(prisma.comment.create).not.toHaveBeenCalled();
  });

  it("異常系: TODOが見つからない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const input = {
      todoId: "123e4567-e89b-12d3-a456-426614174001",
      content: "Test Comment",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await createComment(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("TODOが見つかりません");
    expect(prisma.comment.create).not.toHaveBeenCalled();
  });

  it("異常系: アクセス権限がない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const projectId = "123e4567-e89b-12d3-a456-426614174000";
    const input = {
      todoId,
      content: "Test Comment",
    };

    const mockTodo = {
      id: todoId,
      projectId,
      project: { id: projectId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockTodo);
    (hasProjectAccess as jest.Mock).mockResolvedValue(false);

    const result = await createComment(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("このTODOにアクセスする権限がありません");
    expect(prisma.comment.create).not.toHaveBeenCalled();
  });
});

describe("updateComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: 有効なデータでコメントが更新される", async () => {
    const userId = "user_123";
    const commentId = "comment_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const input = {
      content: "Updated Comment",
    };

    const mockExistingComment = {
      id: commentId,
      todoId,
      userId,
      content: "Original Comment",
      todo: { id: todoId },
    };

    const mockUpdatedComment = {
      ...mockExistingComment,
      content: input.content,
      user: { id: userId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.comment.findFirst as jest.Mock).mockResolvedValue(
      mockExistingComment
    );
    (prisma.comment.update as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const result = await updateComment(commentId, input);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.content).toBe("Updated Comment");
    }
    expect(prisma.comment.update).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith(`/todos/${todoId}`);
  });

  it("異常系: コメントが見つからない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const commentId = "comment_123";
    const input = {
      content: "Updated Comment",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.comment.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await updateComment(commentId, input);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "コメントが見つからないか、編集する権限がありません"
    );
    expect(prisma.comment.update).not.toHaveBeenCalled();
  });
});

describe("deleteComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: コメントが削除される", async () => {
    const userId = "user_123";
    const commentId = "comment_123";
    const todoId = "123e4567-e89b-12d3-a456-426614174001";

    const mockExistingComment = {
      id: commentId,
      todoId,
      userId,
      content: "Test Comment",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.comment.findFirst as jest.Mock).mockResolvedValue(
      mockExistingComment
    );
    (prisma.comment.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteComment(commentId);

    expect(result.success).toBe(true);
    expect(prisma.comment.delete).toHaveBeenCalledWith({
      where: { id: commentId },
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/todos/${todoId}`);
  });

  it("異常系: 削除権限がない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const commentId = "comment_123";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.comment.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await deleteComment(commentId);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "コメントが見つからないか、削除する権限がありません"
    );
    expect(prisma.comment.delete).not.toHaveBeenCalled();
  });
});
