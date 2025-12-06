import { prisma } from "@/lib/prisma";
import type { Todo, Project, Category, Tag, User } from "@prisma/client";

export type TodoWithRelations = Todo & {
  project: Project;
  category: Category | null;
  creator: User;
  todoTags: Array<{
    tag: Tag;
  }>;
};

/**
 * ユーザーがアクセス可能なTODO一覧を取得
 */
export async function getTodosByUserId(userId: string, projectId?: string) {
  try {
    // ユーザーがアクセス可能なプロジェクトを取得
    const accessibleProjects = await prisma.project.findMany({
    where: {
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
    select: {
      id: true,
    },
  });

  const projectIds = accessibleProjects.map((p) => p.id);

  // TODO一覧を取得
  const todos = await prisma.todo.findMany({
    where: {
      projectId: projectId ? projectId : { in: projectIds },
      project: {
        id: { in: projectIds },
      },
    },
    include: {
      project: true,
      category: true,
      creator: true,
      todoTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

    return todos as TodoWithRelations[];
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error("データの取得に失敗しました");
  }
}

/**
 * TODOをIDで取得
 */
export async function getTodoById(todoId: string, userId: string) {
  try {
    // ユーザーがアクセス可能なプロジェクトのTODOのみ取得
    const todo = await prisma.todo.findFirst({
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
      category: true,
      creator: true,
      todoTags: {
        include: {
          tag: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      histories: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

    return todo;
  } catch (error) {
    console.error("Error fetching todo:", error);
    throw new Error("TODOの取得に失敗しました");
  }
}

/**
 * プロジェクトへのアクセス権限を確認
 */
export async function hasProjectAccess(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
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
  });

  return !!project;
}

/**
 * ユーザーがプロジェクトのメンバーかどうかを確認
 */
export async function isProjectMember(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
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
  });

  return !!project;
}
