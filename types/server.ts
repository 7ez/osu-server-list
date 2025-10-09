export type Server = {
  id: number;
  name: string;
  description?: string | null;
  logoUrl: string;
  url: string;
  createdAt: number;
  updatedAt: number;
  features?: string;
  votes: number;
  hasAdminKeys?: boolean;
};
