'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUsersQuery } from '@/features/users/api/queries';
import type { User } from '@/features/users/api/types';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, User2 } from 'lucide-react';

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function UsersPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useUsersQuery();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredUsers = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;

    const term = search.toLowerCase();

    return data.filter((user: User) => {
      return (
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.city.toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  const goToOrders = (userId: number) => {
    router.push(`/orders?userId=${userId}`);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (
      (parts[0][0] ?? '').toUpperCase() + (parts[1][0] ?? '').toUpperCase()
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage your customers and view their orders.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <Input
            placeholder="Search by name, email, username or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="transition focus-visible:ring-1"
          />
        </div>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="space-y-2 px-4 pb-4">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load users.
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          No users match your search.
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <>
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.04 }}
          >
            {paginatedUsers.map((user) => (
              <motion.div
                key={user.id}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              >
                <Card className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-colors duration-300 hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar className="h-10 w-10 border bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 text-xs">
                      <AvatarFallback className="text-[11px] font-medium uppercase">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <User2 className="h-3 w-3 text-muted-foreground" />
                        <span className="line-clamp-1 text-sm font-semibold">
                          {user.fullName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                      >
                        {user.city || 'Unknown'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 px-4 pb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="line-clamp-1">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="line-clamp-1">{user.phone}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto border-t bg-muted/40 p-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex w-full items-center justify-center gap-2 text-xs transition-colors group-hover:bg-primary group-hover:text-emerald-700"
                      onClick={() => goToOrders(user.id)}
                    >
                      View orders
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              className="mt-4 flex items-center justify-between gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} · {filteredUsers.length}{' '}
                users
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="h-8 px-3 text-xs"
                >
                  Prev
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const p = index + 1;
                    const isActive = p === currentPage;
                    return (
                      <Button
                        key={p}
                        size="sm"
                        variant={isActive ? 'default' : 'outline'}
                        className={`h-8 w-8 px-0 text-xs transition ${
                          isActive
                            ? 'shadow-sm'
                            : 'hover:bg-muted/70 hover:text-foreground'
                        }`}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className="h-8 px-3 text-xs"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
