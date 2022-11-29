export type User = {
  id: number;
  name?: string;
  email?: string;
};

export interface Restaurant {
  title: string;
  description: string;
  address: string;
  phone: string;
  rating: number;
}