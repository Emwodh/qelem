export type StreamType = "natural" | "social";

export interface SubjectModule {
  id: string;
  name: string;
  amharicName: string;
  stream: StreamType;
  gradesCovered: string;
  unitsCount: number;
  pastQuestionsCount: number;
  iconName:
    | "Calculator"
    | "Atom"
    | "FlaskConical"
    | "Dna"
    | "Languages"
    | "Brain"
    | "Hourglass"
    | "Compass"
    | "TrendingUp";
  badge?: string;
  highYieldTopics: string[];
  accentColor: string;
}

export interface FeatureItem {
  id: string;
  number: string;
  title: string;
  description: string;
  badge: string;
  iconName: "FileText" | "FolderFilter" | "Timer" | "Crosshair";
  highlightTags: string[];
  statLabel?: string;
  statValue?: string;
}

export interface GradeMastery {
  grade: string;
  label: string;
  percentage: number;
  unitsCompleted: number;
  totalUnits: number;
  statusText: string;
  color: string;
}

export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  badge: string;
  iconName: "Compass" | "Target" | "Award";
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  badge?: string;
  popular?: boolean;
  isFutureTier?: boolean;
  description: string;
  features: string[];
  upcomingFeatures?: string[];
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}
