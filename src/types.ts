export interface PlayApp {
  id: string;
  name: string;
  packageName: string;
  icon: string; // Lucide icon name or emoji symbol
  iconColor: string; // Tailwind color class (e.g., 'bg-blue-500')
  developer: string;
  rating: number;
  reviewsCount: string;
  size: string;
  description: string;
  category: "productivity" | "utilities" | "gaming" | "social" | "creativity" | "entertainment";
  isInstalled: boolean;
  installing: boolean;
  progress: number;
  screenshots: string[];
}

export interface NotesItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  app: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}
