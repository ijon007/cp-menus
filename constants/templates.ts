import type { IconSvgElement } from "@hugeicons/react";
import { 
  Grid02Icon, 
  SparklesIcon, 
  LineIcon 
} from "@hugeicons/core-free-icons";

export const TEMPLATE_IDS = {
  CLASSIC: "classic",
  MODERN: "modern",
  MINIMAL: "minimal",
} as const;

export type TemplateId = typeof TEMPLATE_IDS[keyof typeof TEMPLATE_IDS];

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  icon: IconSvgElement;
}

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  [TEMPLATE_IDS.CLASSIC]: {
    id: TEMPLATE_IDS.CLASSIC,
    name: "Classic",
    description: "Traditional layout with carousel, grid, and list sections",
    icon: Grid02Icon,
  },
  [TEMPLATE_IDS.MODERN]: {
    id: TEMPLATE_IDS.MODERN,
    name: "Modern",
    description: "Contemporary card-based design with bold typography",
    icon: SparklesIcon,
  },
  [TEMPLATE_IDS.MINIMAL]: {
    id: TEMPLATE_IDS.MINIMAL,
    name: "Minimal",
    description: "Clean and simple layout with elegant spacing",
    icon: LineIcon,
  },
};

export const DEFAULT_TEMPLATE = TEMPLATE_IDS.CLASSIC;

export const TEMPLATE_LIST = Object.values(TEMPLATES);

