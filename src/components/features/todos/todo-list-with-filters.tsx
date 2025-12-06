"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Plus, Search, Filter } from "lucide-react";
import type { TodoWithRelations } from "@/dal/todos";

interface TodoListWithFiltersProps {
  todos: TodoWithRelations[];
}

type StatusFilter = "all" | "todo" | "in_progress" | "done";
type PriorityFilter = "all" | "high" | "medium" | "low";

export function TodoListWithFilters({ todos }: TodoListWithFiltersProps) {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // カテゴリとタグの一覧を取得
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    todos.forEach((todo) => {
      if (todo.category) {
        categorySet.add(todo.category.id);
      }
    });
    return Array.from(categorySet).map((id) => {
      const todo = todos.find((t) => t.category?.id === id);
      return { id, name: todo?.category?.name || "" };
    });
  }, [todos]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    todos.forEach((todo) => {
      todo.todoTags.forEach((todoTag) => {
        tagSet.add(todoTag.tag.id);
      });
    });
    return Array.from(tagSet).map((id) => {
      const todo = todos.find((t) => t.todoTags.some((tt) => tt.tag.id === id));
      const tag = todo?.todoTags.find((tt) => tt.tag.id === id)?.tag;
      return { id, name: tag?.name || "" };
    });
  }, [todos]);

  // フィルタリング処理
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // 検索キーワードでフィルタリング（タイトルと説明）
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(keyword);
        const matchesDescription = todo.description?.toLowerCase().includes(keyword) || false;
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // ステータスでフィルタリング
      if (statusFilter !== "all" && todo.status !== statusFilter) {
        return false;
      }

      // 優先度でフィルタリング
      if (priorityFilter !== "all") {
        if (!todo.priority || todo.priority !== priorityFilter) {
          return false;
        }
      }

      // カテゴリでフィルタリング
      if (categoryFilter !== "all") {
        if (!todo.category || todo.category.id !== categoryFilter) {
          return false;
        }
      }

      // タグでフィルタリング
      if (tagFilter !== "all") {
        const hasTag = todo.todoTags.some((todoTag) => todoTag.tag.id === tagFilter);
        if (!hasTag) {
          return false;
        }
      }

      return true;
    });
  }, [todos, searchKeyword, statusFilter, priorityFilter, categoryFilter, tagFilter]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "未着手";
      case "in_progress":
        return "進行中";
      case "done":
        return "完了";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "中";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "todo":
        return "secondary";
      case "in_progress":
        return "default";
      case "done":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityVariant = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TODO一覧</h1>
        <Button asChild>
          <Link href="/todos/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {/* 検索・フィルターエリア */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          {/* 検索バー */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="タイトルや説明を検索..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchKeyword("");
                  }
                }}
                className="pl-10"
                maxLength={255}
                aria-label="TODO検索"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">
                TODOのタイトルや説明を検索できます。最大255文字まで入力できます。
              </span>
            </div>
          </div>

          {/* デスクトップ・タブレット: フィルターをドロップダウンで表示 */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {/* フィルターボタン（ステータス） */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
              <SelectTrigger className="w-[150px]" aria-label="ステータスでフィルタリング">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="todo">未着手</SelectItem>
                <SelectItem value="in_progress">進行中</SelectItem>
                <SelectItem value="done">完了</SelectItem>
              </SelectContent>
            </Select>

            {/* フィルターボタン（優先度） */}
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}>
              <SelectTrigger className="w-[150px]" aria-label="優先度でフィルタリング">
                <SelectValue placeholder="優先度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>

            {/* フィルターボタン（カテゴリ） */}
            {categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]" aria-label="カテゴリでフィルタリング">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* フィルターボタン（タグ） */}
            {tags.length > 0 && (
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[150px]" aria-label="タグでフィルタリング">
                  <SelectValue placeholder="タグ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* スマートフォン: フィルターボタン（モーダルで表示） */}
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="md:hidden" aria-label="フィルターを開く">
                <Filter className="mr-2 h-4 w-4" />
                フィルター
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>フィルター</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* フィルターボタン（ステータス） */}
                <div>
                  <label className="text-sm font-medium mb-2 block">ステータス</label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                    <SelectTrigger aria-label="ステータスでフィルタリング">
                      <SelectValue placeholder="ステータス" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="todo">未着手</SelectItem>
                      <SelectItem value="in_progress">進行中</SelectItem>
                      <SelectItem value="done">完了</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* フィルターボタン（優先度） */}
                <div>
                  <label className="text-sm font-medium mb-2 block">優先度</label>
                  <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityFilter)}>
                    <SelectTrigger aria-label="優先度でフィルタリング">
                      <SelectValue placeholder="優先度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* フィルターボタン（カテゴリ） */}
                {categories.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">カテゴリ</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger aria-label="カテゴリでフィルタリング">
                        <SelectValue placeholder="カテゴリ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* フィルターボタン（タグ） */}
                {tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">タグ</label>
                    <Select value={tagFilter} onValueChange={setTagFilter}>
                      <SelectTrigger aria-label="タグでフィルタリング">
                        <SelectValue placeholder="タグ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TODO一覧 */}
      {filteredTodos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {todos.length === 0 ? "TODOがありません" : "検索条件に一致するTODOがありません"}
            </p>
            {todos.length === 0 && (
              <Button asChild>
                <Link href="/todos/new">最初のTODOを作成</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTodos.map((todo) => (
            <Card
              key={todo.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`TODO: ${todo.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/todos/${todo.id}`);
                }
              }}
              onClick={() => router.push(`/todos/${todo.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{todo.title}</CardTitle>
                  <Badge variant={getStatusVariant(todo.status)}>
                    {getStatusLabel(todo.status)}
                  </Badge>
                </div>
                {todo.description && (
                  <CardDescription className="line-clamp-2">
                    {todo.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">優先度:</span>
                    <Badge variant={getPriorityVariant(todo.priority)}>
                      {getPriorityLabel(todo.priority)}
                    </Badge>
                  </div>
                  {todo.dueDate && (
                    <div className="text-sm text-muted-foreground">
                      期限: {format(new Date(todo.dueDate), "yyyy年MM月dd日", { locale: ja })}
                    </div>
                  )}
                  {todo.category && (
                    <div className="text-sm text-muted-foreground">
                      カテゴリ: {todo.category.name}
                    </div>
                  )}
                  {todo.todoTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {todo.todoTags.map((todoTag) => (
                        <Badge key={todoTag.tag.id} variant="outline">
                          {todoTag.tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/todos/${todo.id}`}>詳細を見る</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

