export interface DocFile {
  id: string;
  name: string;
  folder: string;
  subfolder: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'image' | 'other';
  size: number;
  date: string;
  summary?: string;
  tags?: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface Rule {
  id: string;
  keyword: string;
  targetFolder: string;
  targetSubfolder: string;
  active: boolean;
}

export interface Activity {
  id: string;
  icon: any; // Lucide icon component
  title: string;
  time: string;
  type: 'success' | 'primary' | 'warning' | 'info';
}

export interface UserProfile {
  email: string;
  plan: 'free' | 'pro' | 'business';
  quotaUsed: number;
  quotaLimit: number;
}
