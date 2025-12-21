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
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
}

export default function TemplateRenderer({
  template,
  sections,
  selectedCategory,
  primaryColor,
  secondaryColor,
  accentColor,
  backgroundColor,
}: TemplateRendererProps) {
  const selectedTemplate = template || DEFAULT_TEMPLATE;

  switch (selectedTemplate) {
    case TEMPLATE_IDS.CLASSIC:
      return (
        <ClassicTemplate
          sections={sections}
          selectedCategory={selectedCategory}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
        />
      );
    case TEMPLATE_IDS.MODERN:
      return (
        <ModernTemplate
          sections={sections}
          selectedCategory={selectedCategory}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
        />
      );
    case TEMPLATE_IDS.MINIMAL:
      return (
        <MinimalTemplate
          sections={sections}
          selectedCategory={selectedCategory}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
          backgroundColor={backgroundColor}
        />
      );
    default:
      return (
        <ClassicTemplate
          sections={sections}
          selectedCategory={selectedCategory}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
        />
      );
  }
}

