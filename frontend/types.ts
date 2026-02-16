export enum UserRole {
  CLIENT = 'CLIENT',
  LAWYER = 'LAWYER',
  ADMIN = 'ADMIN'
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface ResourceLink {
  title: string;
  url: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}