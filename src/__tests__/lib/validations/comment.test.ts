import {
  createCommentSchema,
  updateCommentSchema,
} from "@/lib/validations/comment";

describe("createCommentSchema", () => {
  it("有効なデータでバリデーションが成功する", () => {
    const validData = {
      todoId: "123e4567-e89b-12d3-a456-426614174000",
      content: "Test Comment",
    };

    const result = createCommentSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.todoId).toBe("123e4567-e89b-12d3-a456-426614174000");
      expect(result.data.content).toBe("Test Comment");
    }
  });

  it("コメント内容が空の場合、バリデーションが失敗する", () => {
    const invalidData = {
      todoId: "123e4567-e89b-12d3-a456-426614174000",
      content: "",
    };

    const result = createCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("コメント内容が10000文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      todoId: "123e4567-e89b-12d3-a456-426614174000",
      content: "a".repeat(10001),
    };

    const result = createCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("TODO IDがUUID形式でない場合、バリデーションが失敗する", () => {
    const invalidData = {
      todoId: "invalid-uuid",
      content: "Test Comment",
    };

    const result = createCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});

describe("updateCommentSchema", () => {
  it("有効なデータでバリデーションが成功する", () => {
    const validData = {
      content: "Updated Comment",
    };

    const result = updateCommentSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("コメント内容が空の場合、バリデーションが失敗する", () => {
    const invalidData = {
      content: "",
    };

    const result = updateCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("コメント内容が10000文字を超える場合、バリデーションが失敗する", () => {
    const invalidData = {
      content: "a".repeat(10001),
    };

    const result = updateCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
