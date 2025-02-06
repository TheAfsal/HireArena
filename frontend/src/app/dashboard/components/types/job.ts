export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  type?: 'Full Time' | 'Part Time' | 'Contract';
  categories?: string[];
  tags?: {
    type: string
    categories: string[]
  }
}
