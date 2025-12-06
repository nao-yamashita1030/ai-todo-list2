"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCommentFormSchema, type CreateCommentFormInput } from "@/lib/validations/comment";
import { createComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

type CommentFormProps = {
  todoId: string;
};

export function CommentForm({ todoId }: CommentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCommentFormInput>({
    resolver: zodResolver(createCommentFormSchema),
    defaultValues: {
      todoId: todoId,
      content: "",
    },
  });

  const onSubmit = async (data: CreateCommentFormInput) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createComment(data);

      if (result.success) {
        form.reset();
        router.refresh();
      } else {
        setError(result.error || "コメントの作成に失敗しました");
        if (result.details) {
          // フィールドエラーを設定
          Object.entries(result.details).forEach(([field, messages]) => {
            if (messages) {
              form.setError(field as keyof CreateCommentFormInput, {
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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="コメントを入力..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? "送信中..." : "コメントを投稿"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

