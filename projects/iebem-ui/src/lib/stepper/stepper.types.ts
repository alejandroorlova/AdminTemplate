export type StepState = 'pending' | 'active' | 'completed' | 'disabled' | 'error';

export interface StepItem {
  label: string;
  subtitle?: string;
  icon?: string; // fontawesome name, e.g., 'check'
  disabled?: boolean;
  state?: StepState; // optional override if you want manual control
}

