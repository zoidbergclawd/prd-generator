export interface TechStack {
  language: string;
  framework: string;
  testing: string;
}

export interface PRDItem {
  id: number;
  category: string;
  title: string;
  description: string;
  priority: number;
  passes: boolean;
  verification: string;
  steps: string[];
  notes?: string;
}

export interface PRD {
  project: string;
  goal: string;
  tech_stack: TechStack;
  context: {
    target_user: string;
    constraints: string;
    references?: string;
  };
  items: PRDItem[];
}
