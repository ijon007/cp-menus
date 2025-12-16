import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export utilities from utils folder for backward compatibility
export { titleToSlug, formatSlugToTitle } from "@/utils/slug"
