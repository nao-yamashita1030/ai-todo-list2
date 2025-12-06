import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Todo List
        </h1>
        <p className="text-center text-gray-600 mb-8">
          効率的なタスク管理を実現するAI駆動のTODOアプリケーション
        </p>
        <SignedOut>
          <div className="flex justify-center gap-4">
            <p className="text-center text-gray-600">
              ログインまたは新規登録して、TODO管理を始めましょう
            </p>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-gray-600 mb-4">
              ようこそ！TODO管理を始めましょう
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/todos">TODO一覧を見る</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/projects">プロジェクト一覧</Link>
              </Button>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
