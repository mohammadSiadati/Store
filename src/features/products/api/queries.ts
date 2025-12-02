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

/* ⬇️ این بخش جدید است: گرفتن یک محصول بر اساس ID */

async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  return res.json();
}

export function useProductQuery(productId?: number) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId as number),
    enabled: !!productId,
  });
}
