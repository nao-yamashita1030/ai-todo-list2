import { getTodosByUserId, getTodoById, hasProjectAccess } from "@/dal/todos";
import { prisma } from "@/lib/prisma";

// Prismaのモック
jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    todo: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("getTodosByUserId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーがアクセス可能なTODO一覧を取得できる", async () => {
    const userId = "user_123";
    const mockProjects = [{ id: "project_1" }, { id: "project_2" }];
    const mockTodos = [
      {
        id: "todo_1",
        title: "Test Todo 1",
        project: { id: "project_1" },
        category: null,
        creator: { id: userId },
        todoTags: [],
      },
    ];

    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);
    (prisma.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

    const result = await getTodosByUserId(userId);

    expect(result).toEqual(mockTodos);
    expect(prisma.project.findMany).toHaveBeenCalledWith({
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
  });

  it("プロジェクトIDが指定された場合、そのプロジェクトのTODOのみ取得できる", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockProjects = [{ id: "project_1" }];
    const mockTodos = [
      {
        id: "todo_1",
        title: "Test Todo 1",
        project: { id: projectId },
        category: null,
        creator: { id: userId },
        todoTags: [],
      },
    ];

    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);
    (prisma.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

    const result = await getTodosByUserId(userId, projectId);

    expect(result).toEqual(mockTodos);
    expect(prisma.todo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          projectId: projectId,
        }),
      })
    );
  });
});

describe("getTodoById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーがアクセス可能なTODOを取得できる", async () => {
    const userId = "user_123";
    const todoId = "todo_1";
    const mockTodo = {
      id: todoId,
      title: "Test Todo",
      project: { id: "project_1" },
      category: null,
      creator: { id: userId },
      todoTags: [],
      comments: [],
      histories: [],
    };

    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(mockTodo);

    const result = await getTodoById(todoId, userId);

    expect(result).toEqual(mockTodo);
    expect(prisma.todo.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: todoId,
        }),
      })
    );
  });

  it("ユーザーがアクセスできないTODOの場合、nullを返す", async () => {
    const userId = "user_123";
    const todoId = "todo_1";

    (prisma.todo.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await getTodoById(todoId, userId);

    expect(result).toBeNull();
  });
});

describe("hasProjectAccess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーがプロジェクトのオーナーの場合、trueを返す", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockProject = {
      id: projectId,
      ownerId: userId,
    };

    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);

    const result = await hasProjectAccess(projectId, userId);

    expect(result).toBe(true);
  });

  it("ユーザーがプロジェクトのメンバーの場合、trueを返す", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockProject = {
      id: projectId,
      ownerId: "other_user",
      members: [{ userId }],
    };

    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);

    const result = await hasProjectAccess(projectId, userId);

    expect(result).toBe(true);
  });

  it("ユーザーがプロジェクトにアクセスできない場合、falseを返す", async () => {
    const userId = "user_123";
    const projectId = "project_1";

    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await hasProjectAccess(projectId, userId);

    expect(result).toBe(false);
  });
});

