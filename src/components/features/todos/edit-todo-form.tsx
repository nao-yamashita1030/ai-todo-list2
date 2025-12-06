"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateTodoFormSchema,
  type UpdateTodoFormInput,
} from "@/lib/validations/todo";
import { updateTodo } from "@/app/actions/todos";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { TodoWithRelations } from "@/dal/todos";
import type { Project, Category, Tag } from "@prisma/client";

type ProjectWithRelations = Project & {
  categories: Category[];
  tags: Tag[];
};

type EditTodoFormProps = {
  todo: TodoWithRelations;
  project: ProjectWithRelations;
};

export function EditTodoForm({ todo, project }: EditTodoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateTodoFormInput>({
    resolver: zodResolver(updateTodoFormSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      status: todo.status as "todo" | "in_progress" | "done",
      priority: (todo.priority || "medium") as "high" | "medium" | "low",
      dueDate: todo.dueDate
        ? new Date(todo.dueDate).toISOString().split("T")[0]
        : undefined,
      categoryId: todo.categoryId || undefined,
      tagIds: todo.todoTags.map((tt) => tt.tag.id),
    },
  });

  const onSubmit = async (data: UpdateTodoFormInput) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateTodo(todo.id, data);

      if (result.success) {
        router.push(`/todos/${todo.id}`);
        router.refresh();
      } else {
        setError(result.error || "TODOの更新に失敗しました");
        if (result.details) {
          // フィールドエラーを設定
          Object.entries(result.details).forEach(([field, messages]) => {
            if (messages) {
              form.setError(field as keyof UpdateTodoFormInput, {
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
        <Link href={`/todos/${todo.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          詳細に戻る
        </Link>
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>TODO編集</CardTitle>
          <CardDescription>TODOの情報を更新します</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル *</FormLabel>
                    <FormControl>
                      <Input placeholder="TODOのタイトルを入力" {...field} />
                    </FormControl>
                    <FormDescription>
                      TODOのタイトルを入力してください（1-255文字）
                    </FormDescription>
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
                        placeholder="TODOの説明を入力"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      TODOの説明を入力してください（最大10000文字）
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ステータス</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="ステータスを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">未着手</SelectItem>
                          <SelectItem value="in_progress">進行中</SelectItem>
                          <SelectItem value="done">完了</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>優先度</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="優先度を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期限日</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value ? new Date(value).toISOString() : undefined
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      TODOの期限日を選択してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {project.categories.length > 0 && (
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>カテゴリ</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "" ? null : value)
                        }
                        defaultValue={field.value || ""}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="カテゴリを選択（任意）" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">なし</SelectItem>
                          {project.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        カテゴリを選択してください（任意）
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href={`/todos/${todo.id}`}>キャンセル</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "更新中..." : "更新"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
