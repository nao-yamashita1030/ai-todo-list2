import { cn } from "@/lib/utils";

describe("cn", () => {
  it("クラス名をマージできる", () => {
    const result = cn("class1", "class2");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });

  it("条件付きクラス名を処理できる", () => {
    const result = cn("class1", false && "class2", "class3");
    expect(result).toContain("class1");
    expect(result).not.toContain("class2");
    expect(result).toContain("class3");
  });

  it("重複するクラス名をマージできる", () => {
    const result = cn("px-2 py-1", "px-4");
    // tailwind-mergeが重複を解決するため、px-4が優先される
    expect(result).toContain("px-4");
  });

  it("空の引数を処理できる", () => {
    const result = cn();
    expect(result).toBe("");
  });
});
