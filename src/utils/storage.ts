
import { v4 as uuidv4 } from 'uuid';
import { Client, Seller, Concept, Credential, Sale, EntityType } from './types';

// Local storage keys
const STORAGE_KEYS = {
  CLIENTS: 'sales-app-clients',
  SELLERS: 'sales-app-sellers',
  CONCEPTS: 'sales-app-concepts',
  CREDENTIALS: 'sales-app-credentials',
  SALES: 'sales-app-sales',
};

// Helper function to get items from localStorage
const getStoredItems = <T>(key: string): T[] => {
  const storedItems = localStorage.getItem(key);
  return storedItems ? JSON.parse(storedItems) : [];
};

// Helper function to store items in localStorage
const storeItems = <T>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Generic CRUD operations
export const getAll = <T>(entityType: EntityType): T[] => {
  const key = STORAGE_KEYS[entityType.toUpperCase() + 'S' as keyof typeof STORAGE_KEYS];
  return getStoredItems<T>(key);
};

export const getById = <T extends { id: string }>(entityType: EntityType, id: string): T | undefined => {
  const items = getAll<T>(entityType);
  return items.find(item => item.id === id);
};

export const create = <T extends { id?: string; createdAt?: Date }>(entityType: EntityType, item: T): T => {
  const items = getAll<T>(entityType);
  const newItem = { ...item, id: item.id || uuidv4(), createdAt: item.createdAt || new Date() };
  items.push(newItem as T);
  const key = STORAGE_KEYS[entityType.toUpperCase() + 'S' as keyof typeof STORAGE_KEYS];
  storeItems(key, items);
  return newItem as T;
};

export const update = <T extends { id: string }>(entityType: EntityType, item: T): T => {
  const items = getAll<T>(entityType);
  const index = items.findIndex(i => i.id === item.id);
  if (index >= 0) {
    items[index] = { ...items[index], ...item };
    const key = STORAGE_KEYS[entityType.toUpperCase() + 'S' as keyof typeof STORAGE_KEYS];
    storeItems(key, items);
  }
  return item;
};

export const remove = <T extends { id: string }>(entityType: EntityType, id: string): void => {
  const items = getAll<T>(entityType);
  const updatedItems = items.filter(item => item.id !== id);
  const key = STORAGE_KEYS[entityType.toUpperCase() + 'S' as keyof typeof STORAGE_KEYS];
  storeItems(key, updatedItems);
};

// Specific helpers
export const getClients = (): Client[] => getAll<Client>('client');
export const getSellers = (): Seller[] => getAll<Seller>('seller');
export const getConcepts = (): Concept[] => getAll<Concept>('concept');
export const getCredentials = (): Credential[] => getAll<Credential>('credential');
export const getSales = (): Sale[] => getAll<Sale>('sale');

export const getClientById = (id: string): Client | undefined => getById<Client>('client', id);
export const getSellerById = (id: string): Seller | undefined => getById<Seller>('seller', id);
export const getConceptById = (id: string): Concept | undefined => getById<Concept>('concept', id);
export const getCredentialById = (id: string): Credential | undefined => getById<Credential>('credential', id);
export const getSaleById = (id: string): Sale | undefined => getById<Sale>('sale', id);

// Initialize with sample data if empty
export const initializeData = (): void => {
  // Check if we need to initialize (only do this once)
  if (getClients().length === 0) {
    create<Client>('client', {
      name: 'Cliente Ejemplo',
      document: '12345678',
      phone: '987654321',
      email: 'cliente@ejemplo.com',
      address: 'Av. Ejemplo 123',
    } as Client);
  }

  if (getSellers().length === 0) {
    create<Seller>('seller', {
      name: 'Vendedor Ejemplo',
      document: '87654321',
      phone: '123456789',
      email: 'vendedor@ejemplo.com',
    } as Seller);
  }

  if (getConcepts().length === 0) {
    create<Concept>('concept', {
      name: 'Producto A',
      description: 'Descripción del producto A',
    } as Concept);
  }

  if (getCredentials().length === 0) {
    create<Credential>('credential', {
      name: 'Credencial Ejemplo',
      description: 'Descripción de la credencial',
    } as Credential);
  }
};
