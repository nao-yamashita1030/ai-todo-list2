import { LoadingSpinner } from "@/components/common/loading-spinner";

export default function ProjectsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">プロジェクト一覧を読み込み中...</p>
        </div>
      </div>
    </div>
  );
}

