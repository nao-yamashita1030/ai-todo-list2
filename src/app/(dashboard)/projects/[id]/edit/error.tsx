"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ProjectEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログを記録
    console.error("プロジェクト編集画面でエラーが発生しました:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>エラーが発生しました</CardTitle>
          </div>
          <CardDescription>
            プロジェクト情報の取得に失敗しました。指定されたプロジェクトが見つからないか、アクセス権限がない可能性があります。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error.message && (
              <p className="text-sm text-muted-foreground">
                エラー詳細: {error.message}
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={reset} className="flex-1">
                再試行
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/projects">プロジェクト一覧に戻る</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

