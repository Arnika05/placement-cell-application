import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Code,
  Monitor,
  Smartphone,
  BarChart,
  Cpu,
  Brain,
  Palette,
  Box,
  Clipboard,
  Cloud,
  FileText,
  DollarSign,
  CreditCard,
  Headphones,
  Users,
  Currency,
  LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type IconName =
  | "Software Development"
  | "Web Development"
  | "Mobile App Development"
  | "Data Science"
  | "Machine Learning"
  | "Artificial Intelligence"
  | "UI/UX Design"
  | "Product Management"
  | "Project Management"
  | "Cloud Computing"
  | "Business Analysis"
  | "Sales"
  | "Marketing"
  | "Customer Support"
  | "Human Resources"
  | "Finance";

export const iconMapping: Record<IconName, LucideIcon> = {
  "Software Development": Code,
  "Web Development": Monitor,
  "Mobile App Development": Smartphone,
  "Data Science": BarChart,
  "Machine Learning": Cpu,
  "Artificial Intelligence": Brain,
  "UI/UX Design": Palette,
  "Product Management": Box,
  "Project Management": Clipboard,
  "Cloud Computing": Cloud,
  "Business Analysis": FileText,
  "Sales": DollarSign,
  "Marketing": CreditCard,
  "Customer Support": Headphones,
  "Human Resources": Users,
  "Finance": Currency,
};
