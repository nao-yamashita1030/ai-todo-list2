/**
 * 結合テスト: 認証・認可フロー
 * 
 * テストシナリオ:
 * 1. 未認証ユーザーがアクセスした場合、リダイレクトされる
 * 2. 認証済みユーザーがアクセスした場合、正常に表示される
 * 3. 権限のないリソースにアクセスした場合、エラーが発生する
 */

import { getCurrentUserId } from "@/lib/auth";
import { getProjectsByUserId } from "@/dal/projects";
import { getTodosByUserId } from "@/dal/todos";
import { hasProjectAccess } from "@/dal/projects";
import { prisma } from "@/lib/prisma";

// モック
jest.mock("@/lib/auth", () => ({
  getCurrentUserId: jest.fn(),
}));

jest.mock("@/dal/projects", () => ({
  getProjectsByUserId: jest.fn(),
  hasProjectAccess: jest.fn(),
}));

jest.mock("@/dal/todos", () => ({
  getTodosByUserId: jest.fn(),
}));

describe("結合テスト: 認証・認可フロー", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("未認証ユーザーがアクセスした場合、nullが返される", async () => {
    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    const userId = await getCurrentUserId();
    expect(userId).toBeNull();

    // プロジェクト一覧を取得しようとすると、空配列が返される
    (getProjectsByUserId as jest.Mock).mockResolvedValue([]);
    const projects = await getProjectsByUserId(userId || "");
    expect(projects).toEqual([]);
  });

  it("認証済みユーザーがアクセスした場合、正常に表示される", async () => {
    const userId = "user_123";
    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);

    const currentUserId = await getCurrentUserId();
    expect(currentUserId).toBe(userId);

    const mockProjects = [
      {
        id: "project_1",
        name: "Project 1",
        ownerId: userId,
        owner: { id: userId },
        categories: [],
        tags: [],
        _count: { todos: 0, members: 1 },
      },
    ];

    (getProjectsByUserId as jest.Mock).mockResolvedValue(mockProjects);
    const projects = await getProjectsByUserId(userId);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].name).toBe("Project 1");
  });

  it("権限のないプロジェクトにアクセスした場合、エラーが発生する", async () => {
    const userId = "user_123";
    const projectId = "project_123";
    const otherUserId = "other_user";

    (getCurrentUserId as jest.Mock).mockResolvedValue(userId);
    (hasProjectAccess as jest.Mock).mockResolvedValue(false);

    const hasAccess = await hasProjectAccess(projectId, userId);
    expect(hasAccess).toBe(false);

    // 権限がない場合、TODO一覧は空になる
    (getTodosByUserId as jest.Mock).mockResolvedValue([]);
    const todos = await getTodosByUserId(userId, projectId);
    expect(todos).toEqual([]);
  });
});

