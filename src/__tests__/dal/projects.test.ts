import { getProjectsByUserId, getProjectById, hasProjectAccess } from "@/dal/projects";
import { prisma } from "@/lib/prisma";

// Prismaのモック
jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe("getProjectsByUserId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーがアクセス可能なプロジェクト一覧を取得できる", async () => {
    const userId = "user_123";
    const mockProjects = [
      {
        id: "project_1",
        name: "Project 1",
        owner: { id: userId },
        categories: [],
        tags: [],
        _count: { todos: 0, members: 1 },
      },
      {
        id: "project_2",
        name: "Project 2",
        owner: { id: "other_user" },
        categories: [],
        tags: [],
        _count: { todos: 0, members: 2 },
      },
    ];

    (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

    const result = await getProjectsByUserId(userId);

    expect(result).toEqual(mockProjects);
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
      include: {
        owner: true,
        categories: true,
        tags: true,
        _count: {
          select: {
            todos: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
});

describe("getProjectById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーがアクセス可能なプロジェクトを取得できる", async () => {
    const userId = "user_123";
    const projectId = "project_1";
    const mockProject = {
      id: projectId,
      name: "Project 1",
      owner: { id: userId },
      members: [],
      categories: [],
      tags: [],
      _count: { todos: 0 },
    };

    (prisma.project.findFirst as jest.Mock).mockResolvedValue(mockProject);

    const result = await getProjectById(projectId, userId);

    expect(result).toEqual(mockProject);
    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: projectId,
        }),
      })
    );
  });

  it("ユーザーがアクセスできないプロジェクトの場合、nullを返す", async () => {
    const userId = "user_123";
    const projectId = "project_1";

    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await getProjectById(projectId, userId);

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

