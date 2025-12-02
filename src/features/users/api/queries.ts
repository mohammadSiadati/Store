'use client';

import { useQuery } from '@tanstack/react-query';
import type { ApiUser, User } from './types';

const USERS_API_URL = 'https://fakestoreapi.com/users';

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(USERS_API_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  const apiUsers: ApiUser[] = await res.json();

  // مپ کردن دیتا به مدل ساده‌تر برای UI
  return apiUsers.map((u) => ({
    id: u.id,
    fullName: `${u.name.firstname} ${u.name.lastname}`,
    email: u.email,
    username: u.username,
    city: u.address?.city ?? '',
    phone: u.phone,
  }));
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
