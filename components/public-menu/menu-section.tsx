"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuItem from "./menu-item";

interface Item {
  id: string | number;
  name: string;
  price: string;
  description?: string;
  image?: string | null;
}

interface MenuSectionProps {
  title: string;
  items: Item[];
}

export default function MenuSection({ title, items }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <Card className="border-border bg-card mb-6">
      <CardHeader>
        <CardTitle className="text-foreground text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {items.map((item) => (
            <MenuItem key={item.id} name={item.name} price={item.price} description={item.description} image={item.image || "/coffee-cup.webp"} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

