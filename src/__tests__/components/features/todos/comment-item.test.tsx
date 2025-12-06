import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentItem } from "@/components/features/todos/comment-item";
import { updateComment, deleteComment } from "@/app/actions/comments";
import type { Comment } from "@prisma/client";

// モック
jest.mock("@/app/actions/comments", () => ({
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockComment = {
  id: "comment_1",
  todoId: "todo_1",
  userId: "user_1",
  content: "Test Comment",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: {
    name: "Test User",
    email: "test@example.com",
  },
} as Comment & {
  user: { name: string | null; email: string };
};

describe("CommentItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("コメントが正しくレンダリングされる", () => {
    render(<CommentItem comment={mockComment} currentUserId="user_1" />);

    expect(screen.getByText("Test Comment")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("作成者の場合、編集ボタンと削除ボタンが表示される", () => {
    const { container } = render(<CommentItem comment={mockComment} currentUserId="user_1" />);

    // アイコンボタンが存在することを確認（EditとTrash2アイコン）
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("作成者でない場合、編集ボタンと削除ボタンが表示されない", () => {
    const { container } = render(<CommentItem comment={mockComment} currentUserId="user_2" />);

    // 編集・削除ボタンが存在しないことを確認（アイコンボタンがない）
    const buttons = container.querySelectorAll("button");
    // コメント表示時は編集・削除ボタンがない（ダイアログのボタン以外）
    expect(buttons.length).toBe(0);
  });

  it("コメントを編集できる", async () => {
    const user = userEvent.setup();
    const updatedComment = {
      ...mockComment,
      content: "Updated Comment",
    };

    (updateComment as jest.Mock).mockResolvedValue({
      success: true,
      data: updatedComment,
    });

    const { container } = render(<CommentItem comment={mockComment} currentUserId="user_1" />);

    // 編集ボタン（最初のボタン）をクリック
    const buttons = container.querySelectorAll("button");
    if (buttons.length > 0) {
      await user.click(buttons[0]);
    }

    await waitFor(() => {
      const textarea = screen.getByDisplayValue("Test Comment");
      expect(textarea).toBeInTheDocument();
    });

    const textarea = screen.getByDisplayValue("Test Comment");
    const updateButton = screen.getByRole("button", { name: /更新/i });

    await user.clear(textarea);
    await user.type(textarea, "Updated Comment");
    await user.click(updateButton);

    await waitFor(() => {
      expect(updateComment).toHaveBeenCalled();
    });
  });

  it("コメントを削除できる", async () => {
    const user = userEvent.setup();

    (deleteComment as jest.Mock).mockResolvedValue({
      success: true,
    });

    const { container } = render(<CommentItem comment={mockComment} currentUserId="user_1" />);

    // 削除ボタン（2番目のボタン）をクリック
    const buttons = container.querySelectorAll("button");
    if (buttons.length > 1) {
      await user.click(buttons[1]); // 2番目のボタンが削除ボタン
    }

    await waitFor(() => {
      const confirmButton = screen.getByRole("button", { name: /削除/i });
      expect(confirmButton).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole("button", { name: /削除/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith(mockComment.id);
    });
  });
});

