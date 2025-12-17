"use client";

import ClassicTemplate from "./templates/classic-template";
import ModernTemplate from "./templates/modern-template";
import MinimalTemplate from "./templates/minimal-template";
import { DEFAULT_TEMPLATE, TEMPLATE_IDS } from "@/constants/templates";

interface Item {
  id: string | number;
  name: string;
  price: string;
  description?: string;
  image?: string | null;
}

interface Section {
  id: string;
  name: string;
  items: Item[];
}

interface TemplateRendererProps {
  template: string | null | undefined;
  sections: Section[];
  selectedCategory: string | null;
}

export default function TemplateRenderer({
  template,
  sections,
  selectedCategory,
}: TemplateRendererProps) {
  const selectedTemplate = template || DEFAULT_TEMPLATE;

  switch (selectedTemplate) {
    case TEMPLATE_IDS.CLASSIC:
      return <ClassicTemplate sections={sections} selectedCategory={selectedCategory} />;
    case TEMPLATE_IDS.MODERN:
      return <ModernTemplate sections={sections} selectedCategory={selectedCategory} />;
    case TEMPLATE_IDS.MINIMAL:
      return <MinimalTemplate sections={sections} selectedCategory={selectedCategory} />;
    default:
      return <ClassicTemplate sections={sections} selectedCategory={selectedCategory} />;
  }
}

