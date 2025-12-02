'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiCart, Order } from './types';

const CARTS_API_URL = 'https://fakestoreapi.com/carts';

async function fetchOrders(userId?: number): Promise<Order[]> {
  const res = await fetch(CARTS_API_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }

  const apiCarts: ApiCart[] = await res.json();

  let filtered = apiCarts;

  if (userId) {
    filtered = apiCarts.filter((cart) => cart.userId === userId);
  }

  return filtered.map((cart) => {
    const totalQuantity = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    const itemsCount = cart.products.length;

    return {
      id: cart.id,
      userId: cart.userId,
      date: cart.date,
      itemsCount,
      totalQuantity,
    };
  });
}

export function useOrdersQuery(userId?: number) {
  return useQuery({
    queryKey: ['orders', userId ?? 'all'],
    queryFn: () => fetchOrders(userId),
  });
}
