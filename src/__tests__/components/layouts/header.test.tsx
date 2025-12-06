import { render, screen } from "@testing-library/react";
import { Header } from "@/components/layouts/header";

// モック
jest.mock("@clerk/nextjs", () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  UserButton: () => <div>UserButton</div>,
}));

describe("Header", () => {
  it("ヘッダーが正しくレンダリングされる", () => {
    render(<Header />);

    expect(screen.getByText("AI Todo List")).toBeInTheDocument();
  });

  it("ログインしていない場合、ログインボタンと新規登録ボタンが表示される", () => {
    render(<Header />);

    expect(screen.getByText("ログイン")).toBeInTheDocument();
    expect(screen.getByText("新規登録")).toBeInTheDocument();
  });
});

