"use server";

import { getCurrentUserId } from "@/lib/auth";
import { hasProjectAccess } from "@/dal/projects";
import { prisma } from "@/lib/prisma";
import { createTodoSchema, updateTodoSchema, type CreateTodoFormInput, type UpdateTodoFormInput } from "@/lib/validations/todo";
import { revalidatePath } from "next/cache";

/**
 * TODOを作成する
 */
export async function createTodo(input: CreateTodoFormInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // バリデーション（dueDateをDateに変換）
  const validationResult = createTodoSchema.safeParse({
    ...input,
    dueDate: input.dueDate ? input.dueDate : undefined,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: "入力データが不正です",
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  // プロジェクトへのアクセス権限を確認
  const hasAccess = await hasProjectAccess(data.projectId, userId);

  if (!hasAccess) {
    return {
      success: false,
      error: "このプロジェクトにアクセスする権限がありません",
    };
  }

  // カテゴリのバリデーション（指定されている場合）
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        projectId: data.projectId,
      },
    });

    if (!category) {
      return {
        success: false,
        error: "指定されたカテゴリが見つからないか、このプロジェクトに属していません",
      };
    }
  }

  // タグのバリデーション（指定されている場合）
  if (data.tagIds && data.tagIds.length > 0) {
    const tags = await prisma.tag.findMany({
      where: {
        id: { in: data.tagIds },
        projectId: data.projectId,
      },
    });

    if (tags.length !== data.tagIds.length) {
      return {
        success: false,
        error: "指定されたタグが見つからないか、このプロジェクトに属していません",
      };
    }
  }

  try {
    // TODOを作成
    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        projectId: data.projectId,
        categoryId: data.categoryId,
        createdBy: userId,
        todoTags: data.tagIds
          ? {
              create: data.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        project: true,
        category: true,
        creator: true,
      },
    });

    // 変更履歴を記録
    await prisma.history.create({
      data: {
        todoId: todo.id,
        userId: userId,
        action: "created",
        newValue: JSON.stringify({
          title: todo.title,
          status: todo.status,
          priority: todo.priority,
        }),
      },
    });

    // キャッシュを無効化
    revalidatePath("/todos");
    revalidatePath(`/projects/${data.projectId}`);

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    console.error("TODO作成エラー:", error);
    return {
      success: false,
      error: "データの保存に失敗しました",
    };
  }
}

/**
 * TODOを更新する
 */
export async function updateTodo(todoId: string, input: UpdateTodoFormInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // 既存のTODOを取得
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      project: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    },
    include: {
      project: true,
    },
  });

  if (!existingTodo) {
    return {
      success: false,
      error: "TODOが見つかりません",
    };
  }

  // 編集権限を確認（TODOの作成者またはプロジェクトのメンバー（ownerまたはmember））
  // 既にexistingTodoを取得する際にプロジェクトへのアクセス権限を確認しているため、
  // プロジェクトオーナーまたはメンバーであることは確認済み
  // 作成者でない場合でも、プロジェクトメンバーであれば編集可能
  const isCreator = existingTodo.createdBy === userId;
  const isOwner = existingTodo.project.ownerId === userId;
  
  // 作成者でもオーナーでもない場合、プロジェクトメンバーかどうかを確認
  if (!isCreator && !isOwner) {
    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId: existingTodo.projectId,
        userId: userId,
      },
    });

    if (!isMember) {
      return {
        success: false,
        error: "このTODOを編集する権限がありません",
      };
    }
  }

  // バリデーション（dueDateをDateに変換）
  const validationResult = updateTodoSchema.safeParse({
    ...input,
    dueDate: input.dueDate ? input.dueDate : undefined,
  });

  if (!validationResult.success) {
    return {
      success: false,
      error: "入力データが不正です",
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  // カテゴリのバリデーション（指定されている場合）
  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        projectId: existingTodo.projectId,
      },
    });

    if (!category) {
      return {
        success: false,
        error: "指定されたカテゴリが見つからないか、このプロジェクトに属していません",
      };
    }
  }

  // タグのバリデーション（指定されている場合）
  if (data.tagIds && data.tagIds.length > 0) {
    const tags = await prisma.tag.findMany({
      where: {
        id: { in: data.tagIds },
        projectId: existingTodo.projectId,
      },
    });

    if (tags.length !== data.tagIds.length) {
      return {
        success: false,
        error: "指定されたタグが見つからないか、このプロジェクトに属していません",
      };
    }
  }

  try {
    // 変更前の値を保存
    const oldValue = {
      title: existingTodo.title,
      status: existingTodo.status,
      priority: existingTodo.priority,
    };

    // TODOを更新
    const todo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        categoryId: data.categoryId === null ? null : data.categoryId,
        todoTags: data.tagIds
          ? {
              deleteMany: {},
              create: data.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        project: true,
        category: true,
        creator: true,
      },
    });

    // 変更履歴を記録
    await prisma.history.create({
      data: {
        todoId: todo.id,
        userId: userId,
        action: data.status && data.status !== existingTodo.status ? "status_changed" : "updated",
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify({
          title: todo.title,
          status: todo.status,
          priority: todo.priority,
        }),
      },
    });

    // キャッシュを無効化
    revalidatePath("/todos");
    revalidatePath(`/todos/${todoId}`);
    revalidatePath(`/projects/${todo.projectId}`);

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    console.error("TODO更新エラー:", error);
    return {
      success: false,
      error: "データの更新に失敗しました",
    };
  }
}

/**
 * TODOを削除する
 */
export async function deleteTodo(todoId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // 既存のTODOを取得
  const existingTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      project: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    },
    include: {
      project: true,
    },
  });

  if (!existingTodo) {
    return {
      success: false,
      error: "TODOが見つかりません",
    };
  }

  // 削除権限を確認（TODOの作成者またはプロジェクトのオーナー）
  const canDelete = existingTodo.createdBy === userId || existingTodo.project.ownerId === userId;

  if (!canDelete) {
    return {
      success: false,
      error: "このTODOを削除する権限がありません",
    };
  }

  try {
    // 変更履歴を記録
    await prisma.history.create({
      data: {
        todoId: existingTodo.id,
        userId: userId,
        action: "deleted",
        oldValue: JSON.stringify({
          title: existingTodo.title,
          status: existingTodo.status,
          priority: existingTodo.priority,
        }),
      },
    });

    // TODOを削除（CASCADEで関連データも削除される）
    await prisma.todo.delete({
      where: { id: todoId },
    });

    // キャッシュを無効化
    revalidatePath("/todos");
    revalidatePath(`/projects/${existingTodo.projectId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("TODO削除エラー:", error);
    return {
      success: false,
      error: "データの削除に失敗しました",
    };
  }
}

