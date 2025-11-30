'use client';

import { useQuery } from '@tanstack/react-query';
import type { Product } from './types';

const API_URL = 'https://fakestoreapi.com/products';

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}
