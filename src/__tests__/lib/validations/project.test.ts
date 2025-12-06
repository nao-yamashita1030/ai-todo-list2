import { createProjectSchema, updateProjectSchema } from "@/lib/validations/project";

describe("createProjectSchema", () => {
  it("有効なデータでバリデーションが成功する", () => {
    const validData = {
      name: "Test Project",
      description: "Test Description",
    };

    const result = createProjectSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Test Project");
      expect(result.data.description).toBe("Test Description");
    }
  });

  it("プロジェクト名が空の場合、バリデーションが失敗する", () => {
    const invalidData = {
      name: "",
      description: "Test Description",
    };

    const result = createProjectSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("プロジェクト名が255文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      name: "a".repeat(256),
      description: "Test Description",
    };

    const result = createProjectSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("説明が10000文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      name: "Test Project",
      description: "a".repeat(10001),
    };

    const result = createProjectSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("説明がオプショナル", () => {
    const validData = {
      name: "Test Project",
    };

    const result = createProjectSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });
});

describe("updateProjectSchema", () => {
  it("有効なデータでバリデーションが成功する", () => {
    const validData = {
      name: "Updated Project",
      description: "Updated Description",
    };

    const result = updateProjectSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("すべてのフィールドがオプショナル", () => {
    const validData = {};

    const result = updateProjectSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("プロジェクト名が255文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      name: "a".repeat(256),
    };

    const result = updateProjectSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});

