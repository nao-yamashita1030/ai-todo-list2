import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { CommentForm } from "@/components/features/todos/comment-form";
import { createComment } from "@/app/actions/comments";

// モック
jest.mock("@/app/actions/comments", () => ({
  createComment: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("CommentForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("フォームが正しくレンダリングされる", () => {
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    render(<CommentForm todoId={todoId} />);

    expect(screen.getByPlaceholderText(/コメントを入力/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /コメントを投稿/i })
    ).toBeInTheDocument();
  });

  it("コメントを送信できる", async () => {
    const user = userEvent.setup();
    const todoId = "123e4567-e89b-12d3-a456-426614174001";
    const mockComment = {
      id: "comment_123",
      todoId,
      content: "Test Comment",
    };

    (createComment as jest.Mock).mockResolvedValue({
      success: true,
      data: mockComment,
    });

    render(<CommentForm todoId={todoId} />);

    const textarea = screen.getByPlaceholderText(/コメントを入力/i);
    const submitButton = screen.getByRole("button", {
      name: /コメントを投稿/i,
    });

    await user.type(textarea, "Test Comment");
    await user.click(submitButton);

    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith({
        todoId,
        content: "Test Comment",
      });
    });
  });

  it("エラーが発生した場合、エラーメッセージを表示する", async () => {
    const user = userEvent.setup();
    const todoId = "123e4567-e89b-12d3-a456-426614174001";

    (createComment as jest.Mock).mockResolvedValue({
      success: false,
      error: "コメントの作成に失敗しました",
    });

    render(<CommentForm todoId={todoId} />);

    const textarea = screen.getByPlaceholderText(/コメントを入力/i);
    const submitButton = screen.getByRole("button", {
      name: /コメントを投稿/i,
    });

    await user.type(textarea, "Test Comment");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("コメントの作成に失敗しました")
      ).toBeInTheDocument();
    });
  });

  it("空のコメントを送信できない", async () => {
    const user = userEvent.setup();
    const todoId = "123e4567-e89b-12d3-a456-426614174001";

    render(<CommentForm todoId={todoId} />);

    const submitButton = screen.getByRole("button", {
      name: /コメントを投稿/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(createComment).not.toHaveBeenCalled();
    });
  });
});
