"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function TodosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログを記録
    console.error("TODO一覧画面でエラーが発生しました:", error);
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
            データの取得に失敗しました。しばらくしてから再度お試しください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error.message && (
              <p className="text-sm text-muted-foreground">
                エラー詳細: {error.message}
              </p>
            )}
            <Button onClick={reset} className="w-full">
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

