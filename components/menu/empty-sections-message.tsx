"use client";

/* Components */
import { Card, CardContent } from "@/components/ui/card";

export default function EmptySectionsMessage() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground text-sm">
          No sections yet. Click "Add Section" to get started.
        </p>
      </CardContent>
    </Card>
  );
}

