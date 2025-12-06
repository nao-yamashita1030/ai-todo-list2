import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingSpinner } from "@/components/common/loading-spinner";

describe("LoadingSpinner", () => {
  it("デフォルトサイズでレンダリングされる", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText("読み込み中");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-8", "w-8");
  });

  it("小さいサイズでレンダリングされる", () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByLabelText("読み込み中");
    expect(spinner).toHaveClass("h-4", "w-4");
  });

  it("大きいサイズでレンダリングされる", () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByLabelText("読み込み中");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("カスタムクラス名を適用できる", () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByLabelText("読み込み中");
    expect(spinner).toHaveClass("custom-class");
  });
});
