import {
  createProject,
  updateProject,
  deleteProject,
} from "@/app/actions/projects";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
  syncUser: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectMember: {
      create: jest.fn(),
    },
  },
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("createProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: 有効なデータでプロジェクトが作成される", async () => {
    const userId = "user_123";
    const input = {
      name: "Test Project",
      description: "Test Description",
    };

    const mockProject = {
      id: "project_123",
      name: input.name,
      description: input.description,
      ownerId: userId,
      owner: { id: userId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);
    (prisma.projectMember.create as jest.Mock).mockResolvedValue({});

    const result = await createProject(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockProject);
    }
    expect(prisma.project.create).toHaveBeenCalledTimes(1);
    expect(prisma.projectMember.create).toHaveBeenCalledWith({
      data: {
        projectId: mockProject.id,
        userId: userId,
        role: "owner",
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
  });

  it("異常系: 認証エラーが発生する", async () => {
    const input = {
      name: "Test Project",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    const result = await createProject(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("認証が必要です");
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it("異常系: バリデーションエラーが発生する", async () => {
    const userId = "user_123";
    const input = {
      name: "", // 空のプロジェクト名
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);

    const result = await createProject(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("入力データが不正です");
    expect(prisma.project.create).not.toHaveBeenCalled();
  });
});

describe("updateProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: 有効なデータでプロジェクトが更新される", async () => {
    const userId = "user_123";
    const projectId = "project_123";
    const input = {
      name: "Updated Project",
      description: "Updated Description",
    };

    const mockExistingProject = {
      id: projectId,
      name: "Original Project",
      description: "Original Description",
      ownerId: userId,
    };

    const mockUpdatedProject = {
      ...mockExistingProject,
      ...input,
      owner: { id: userId },
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(
      mockExistingProject
    );
    (prisma.project.update as jest.Mock).mockResolvedValue(mockUpdatedProject);

    const result = await updateProject(projectId, input);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.name).toBe("Updated Project");
    }
    expect(prisma.project.update).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
  });

  it("異常系: プロジェクトが見つからない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const projectId = "project_123";
    const input = {
      name: "Updated Project",
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await updateProject(projectId, input);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "プロジェクトが見つからないか、編集する権限がありません"
    );
    expect(prisma.project.update).not.toHaveBeenCalled();
  });
});

describe("deleteProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正常系: プロジェクトが削除される", async () => {
    const userId = "user_123";
    const projectId = "project_123";

    const mockExistingProject = {
      id: projectId,
      name: "Test Project",
      ownerId: userId,
    };

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(
      mockExistingProject
    );
    (prisma.project.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteProject(projectId);

    expect(result.success).toBe(true);
    expect(prisma.project.delete).toHaveBeenCalledWith({
      where: { id: projectId },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
  });

  it("異常系: 削除権限がない場合、エラーが発生する", async () => {
    const userId = "user_123";
    const projectId = "project_123";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await deleteProject(projectId);

    expect(result.success).toBe(false);
    expect(result.error).toBe(
      "プロジェクトが見つからないか、削除する権限がありません"
    );
    expect(prisma.project.delete).not.toHaveBeenCalled();
  });
});
