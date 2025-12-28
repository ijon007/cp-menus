import { Spinner } from "@/components/ui/spinner";

export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Spinner className="size-5" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    </div>
  );
}

