"use server";

import { getCurrentUserId } from "@/lib/auth";
import { hasProjectAccess } from "@/dal/projects";
import { prisma } from "@/lib/prisma";
import { createCommentSchema, updateCommentSchema, type CreateCommentFormInput, type UpdateCommentFormInput } from "@/lib/validations/comment";
import { revalidatePath } from "next/cache";

/**
 * コメントを作成する
 */
export async function createComment(input: CreateCommentFormInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // バリデーション
  const validationResult = createCommentSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "入力データが不正です",
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  // TODOの存在確認とアクセス権限を確認
  const todo = await prisma.todo.findFirst({
    where: {
      id: data.todoId,
    },
    include: {
      project: true,
    },
  });

  if (!todo) {
    return {
      success: false,
      error: "TODOが見つかりません",
    };
  }

  // TODOへのアクセス権限を確認（TODOの作成者またはプロジェクトのメンバー）
  const hasAccess = await hasProjectAccess(todo.projectId, userId);

  if (!hasAccess) {
    return {
      success: false,
      error: "このTODOにアクセスする権限がありません",
    };
  }

  try {
    // コメントを作成
    const comment = await prisma.comment.create({
      data: {
        todoId: data.todoId,
        userId: userId,
        content: data.content,
      },
      include: {
        user: true,
      },
    });

    // キャッシュを無効化
    revalidatePath(`/todos/${data.todoId}`);

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("コメント作成エラー:", error);
    return {
      success: false,
      error: "データの保存に失敗しました",
    };
  }
}

/**
 * コメントを更新する
 */
export async function updateComment(commentId: string, input: UpdateCommentFormInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // 既存のコメントを取得
  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId: userId, // 作成者のみ編集可能
    },
    include: {
      todo: true,
    },
  });

  if (!existingComment) {
    return {
      success: false,
      error: "コメントが見つからないか、編集する権限がありません",
    };
  }

  // バリデーション
  const validationResult = updateCommentSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "入力データが不正です",
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  try {
    // コメントを更新
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: data.content,
      },
      include: {
        user: true,
      },
    });

    // キャッシュを無効化
    revalidatePath(`/todos/${existingComment.todoId}`);

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("コメント更新エラー:", error);
    return {
      success: false,
      error: "データの更新に失敗しました",
    };
  }
}

/**
 * コメントを削除する
 */
export async function deleteComment(commentId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // 既存のコメントを取得
  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId: userId, // 作成者のみ削除可能
    },
  });

  if (!existingComment) {
    return {
      success: false,
      error: "コメントが見つからないか、削除する権限がありません",
    };
  }

  try {
    // コメントを削除
    await prisma.comment.delete({
      where: { id: commentId },
    });

    // キャッシュを無効化
    revalidatePath(`/todos/${existingComment.todoId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("コメント削除エラー:", error);
    return {
      success: false,
      error: "データの削除に失敗しました",
    };
  }
}

