"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectFormSchema, type CreateProjectFormInput } from "@/lib/validations/project";
import { createProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CreateProjectForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProjectFormInput>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateProjectFormInput) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createProject(data);

      if (result.success) {
        router.push("/projects");
        router.refresh();
      } else {
        setError(result.error || "プロジェクトの作成に失敗しました");
        if (result.details) {
          // フィールドエラーを設定
          Object.entries(result.details).forEach(([field, messages]) => {
            if (messages) {
              form.setError(field as keyof CreateProjectFormInput, {
                type: "manual",
                message: messages[0],
              });
            }
          });
        }
      }
    } catch (err) {
      setError("予期しないエラーが発生しました");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          一覧に戻る
        </Link>
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>プロジェクト情報</CardTitle>
          <CardDescription>新しいプロジェクトを作成します</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロジェクト名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="プロジェクト名を入力" {...field} />
                    </FormControl>
                    <FormDescription>プロジェクト名を入力してください（1-255文字）</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="プロジェクトの説明を入力"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>プロジェクトの説明を入力してください（最大10000文字）</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/projects">キャンセル</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "作成中..." : "作成"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

