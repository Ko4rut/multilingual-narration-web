export type LanguageStatus = "Active" | "Inactive";

export type LanguageItem = {
  id: string;
  code: string;
  name: string;
  flag: string;       
  isActive: boolean;  
  narrations: number; 
};


export type LanguageOverviewProps = {
  q: string;
  status: string;
  page: number;
};

export type LanguageFilterBarProps = {
  initialQ: string;
  totalCount: number;
  activeCount: number;
};

export type LanguageTableProps = {
  q: string;
  status: string;
  currentPage: number;
};

export type LanguageGridProps = {
  q: string;
  languages: LanguageItem[];
  onToggleStatus: (id: string) => void;
};

export type LanguagePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};