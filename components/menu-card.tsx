"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit02Icon, Delete02Icon, EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { titleToSlug } from "@/lib/utils";

interface MenuCardProps {
  menuName: string;
  businessName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MenuCard = ({ menuName, businessName, onEdit, onDelete }: MenuCardProps) => {
  const router = useRouter();

  const handleViewLiveMenu = () => {
    if (businessName) {
      const slug = titleToSlug(businessName);
      router.push(`/${slug}`);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle 
          className="text-foreground cursor-pointer hover:underline"
          onClick={() => router.push(`/menus/${menuName}`)}
        >
          {menuName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2">
          {businessName && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleViewLiveMenu}
              className="hover:opacity-90"
            >
              <HugeiconsIcon icon={EyeIcon} strokeWidth={2} />
              <span>View Live</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="border-border hover:bg-accent hover:text-accent-foreground"
          >
            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} /> 
            <span>Rename</span>
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDelete}
            className="hover:opacity-90"
          >
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;