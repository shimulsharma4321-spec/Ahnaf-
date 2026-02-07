
export interface VideoProject {
  id: string;
  title: string;
  driveLink: string;
  description?: string;
  category?: string;
  createdAt: number;
}

export type Category = 'Commercial' | 'Music Video' | 'Documentary' | 'Social Media';
