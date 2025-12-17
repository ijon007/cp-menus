"use client";

/* Components */
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

/* Constants */
import { TEMPLATE_LIST, TEMPLATES, DEFAULT_TEMPLATE } from "@/constants/templates";
import { cn } from "@/lib/utils";

interface TemplateSelectionSectionProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  disabled?: boolean;
}

export default function TemplateSelectionSection({
  selectedTemplate,
  onTemplateChange,
  disabled = false,
}: TemplateSelectionSectionProps) {
  const currentTemplate = selectedTemplate || DEFAULT_TEMPLATE;
  const selectedTemplateName = TEMPLATES[currentTemplate as keyof typeof TEMPLATES]?.name || TEMPLATES[DEFAULT_TEMPLATE].name;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Menu Styles</h3>
      </div>
      <div className="space-y-2">
        <Label htmlFor="menu-template">Template</Label>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                id="menu-template"
                variant="outline"
                className="w-full justify-between"
                disabled={disabled}
              />
            }
          >
            <span>{selectedTemplateName}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            {TEMPLATE_LIST.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => onTemplateChange(template.id)}
                className={cn("cursor-pointer mb-1", currentTemplate === template.id ? "bg-accent" : "")}
              >
                {template.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

