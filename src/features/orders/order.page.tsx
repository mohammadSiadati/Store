'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOrdersQuery } from '@/features/orders/api/queries';
import type { Order } from '@/features/orders/api/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  CalendarDays,
  Package2,
  User2,
  Clock,
  CircleDot,
  ArrowRight,
} from 'lucide-react';
import { useOrderStore } from '@/core/store/order.store';

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const getId = useOrderStore((state) => state.setId);

  const userIdParam = searchParams.get('userId');
  const userIdFilter = userIdParam ? Number(userIdParam) : undefined;

  const { data, isLoading, isError } = useOrdersQuery(userIdFilter);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredOrders = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;

    const term = search.toLowerCase();

    return data.filter((order: Order) => {
      return (
        String(order.id).includes(term) ||
        String(order.userId).includes(term) ||
        order.date.toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, pageSize]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const clearUserFilter = () => {
    router.push('/orders');
  };

  const getStatus = (order: Order) => {
    const m = order.id % 3;
    if (m === 0) return 'Delivered';
    if (m === 1) return 'Processing';
    return 'Pending';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'outline' as const;
      case 'Processing':
        return 'secondary' as const;
      case 'Pending':
      default:
        return 'outline' as const;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Delivered') return 'text-emerald-500';
    if (status === 'Processing') return 'text-amber-500';
    return 'text-muted-foreground';
  };

  const formatDate = (value: string) => {
    const d = new Date(value);
    return d.toLocaleDateString();
  };

  const getEstimatedDate = (value: string) => {
    const d = new Date(value);
    const est = new Date(d.getTime() + 3 * 24 * 60 * 60 * 1000);
    return est.toLocaleDateString();
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
          <h2 className="text-2xl font-semibold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            View customer orders, status and items summary.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {userIdFilter && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline">
                Filter · User ID:
                <span className="ml-1 font-medium">{userIdFilter}</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={clearUserFilter}
              >
                Clear
              </Button>
            </div>
          )}
          <div className="w-full max-w-xs">
            <Input
              placeholder="Search by order id, date or user id..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="transition focus-visible:ring-1"
            />
          </div>
        </div>
      </motion.div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm"
            >
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="space-y-2 px-4 pb-4">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load orders.
        </div>
      )}

      {!isLoading && !isError && filteredOrders.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          No orders found.
        </div>
      )}

      {!isLoading && !isError && filteredOrders.length > 0 && (
        <>
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.04 }}
          >
            {paginatedOrders.map((order) => {
              const status = getStatus(order);
              const statusColor = getStatusColor(status);

              return (
                <motion.div
                  key={order.id}
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                >
                  <Card className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-colors duration-300 hover:shadow-xl">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Order</span>
                          <Badge variant="outline" className="text-[10px]">
                            #{order.id}
                          </Badge>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(status)}
                          className={`flex items-center gap-1 text-[10px] ${statusColor}`}
                        >
                          <CircleDot className="h-3 w-3" />
                          {status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User2 className="h-3 w-3" />
                        <span>User ID: {order.userId}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 px-4 pb-2">
                      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3 w-3" />
                          <span>Created: {formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            Est. delivery: {getEstimatedDate(order.date)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Package2 className="h-3 w-3" />
                          <span>{order.itemsCount} items</span>
                        </div>
                        <span className="font-medium">
                          {order.totalQuantity} qty
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="mt-auto border-t bg-muted/40 p-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex w-full items-center justify-center gap-2 text-xs transition-colors group-hover:bg-primary group-hover:text-emerald-600"
                        onClick={() => {
                          getId(order.id);
                          router.push(`/orders/${order.id}`);
                        }}
                      >
                        View details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {totalPages > 1 && (
            <motion.div
              className="mt-4 flex items-center justify-between gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} · {filteredOrders.length}{' '}
                orders
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
