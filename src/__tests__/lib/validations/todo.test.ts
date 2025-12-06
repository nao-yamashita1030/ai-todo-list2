import { createTodoSchema, updateTodoSchema } from "@/lib/validations/todo";

describe("createTodoSchema", () => {
  it("有効なデータでバリデーションが成功する", () => {
    const validData = {
      title: "Test Todo",
      description: "Test Description",
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };

    const result = createTodoSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Test Todo");
      expect(result.data.status).toBe("todo");
      expect(result.data.priority).toBe("high");
    }
  });

  it("タイトルが空の場合、バリデーションが失敗する", () => {
    const invalidData = {
      title: "",
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };

    const result = createTodoSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("タイトルが255文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      title: "a".repeat(256),
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };

    const result = createTodoSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("説明が10000文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      title: "Test Todo",
      description: "a".repeat(10001),
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
    };

    const result = createTodoSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("プロジェクトIDがUUID形式でない場合、バリデーションが失敗する", () => {
    const invalidData = {
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId: "invalid-uuid",
    };

    const result = createTodoSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("dueDateが文字列の場合、Dateオブジェクトに変換される", () => {
    const validData = {
      title: "Test Todo",
      status: "todo" as const,
      priority: "high" as const,
      projectId: "123e4567-e89b-12d3-a456-426614174000",
      dueDate: "2025-12-31T00:00:00.000Z",
    };

    const result = createTodoSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dueDate).toBeInstanceOf(Date);
    }
  });
});

describe("updateTodoSchema", () => {
  it("有効なデータでバリデーションが成功する", () => {
    const validData = {
      title: "Updated Todo",
      status: "in_progress" as const,
      priority: "medium" as const,
    };

    const result = updateTodoSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("すべてのフィールドがオプショナル", () => {
    const validData = {};

    const result = updateTodoSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("タイトルが255文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      title: "a".repeat(256),
    };

    const result = updateTodoSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
