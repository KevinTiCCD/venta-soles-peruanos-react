
export interface Client {
  id: string;
  name: string;
  document: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: Date;
}

export interface Seller {
  id: string;
  name: string;
  document: string;
  phone?: string;
  email?: string;
  createdAt: Date;
}

export interface Concept {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Credential {
  id: string;
  name: string;
  description?: string;
  password?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  date: Date;
  clientId: string;
  sellerId: string;
  conceptId: string;
  observation?: string;
  amount: number;
  createdAt: Date;
}

export type EntityType = 'client' | 'seller' | 'concept' | 'credential' | 'sale';
