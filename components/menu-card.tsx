"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MenuCardProps {
  menuName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MenuCard = ({ menuName, onEdit, onDelete }: MenuCardProps) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{menuName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="border-border hover:bg-accent hover:text-accent-foreground"
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDelete}
            className="hover:opacity-90"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;