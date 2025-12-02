'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProductsQuery } from '@/features/products/api/queries';
import { useUsersQuery } from '@/features/users/api/queries';
import { useOrdersQuery } from '@/features/orders/api/queries';
import type { Product } from '@/features/products/api/types';
import type { Order } from '@/features/orders/api/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Package2,
  Users,
  ShoppingBag,
  Layers,
  CalendarDays,
  ArrowRight,
  Activity,
  TrendingUp,
} from 'lucide-react';

const kpiCardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const listItemVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useProductsQuery();

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsersQuery();

  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useOrdersQuery();

  const loading = productsLoading || usersLoading || ordersLoading;
  const hasError = productsError || usersError || ordersError;

  const totalProducts = products?.length ?? 0;
  const totalUsers = users?.length ?? 0;
  const totalOrders = orders?.length ?? 0;

  const totalOrderQuantity = useMemo(() => {
    if (!orders) return 0;
    return orders.reduce(
      (sum: number, order: Order) => sum + order.totalQuantity,
      0
    );
  }, [orders]);

  const avgItemsPerOrder = useMemo(() => {
    if (!totalOrders) return 0;
    return Number((totalOrderQuantity / totalOrders).toFixed(1));
  }, [totalOrders, totalOrderQuantity]);

  const recentOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [orders]);

  const topCategories = useMemo(() => {
    if (!products) return [];

    const map = new Map<string, number>();
    products.forEach((p: Product) => {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    });

    const arr = Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    const sorted = arr.sort((a, b) => b.count - a.count).slice(0, 5);
    const max = sorted[0]?.count ?? 1;

    return sorted.map((item) => ({
      ...item,
      percent: Math.round((item.count / max) * 100),
    }));
  }, [products]);

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            Realtime store overview
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Welcome back, Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor products, customers and orders at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="transition hover:-translate-y-px"
          >
            <Link href="/products">
              <Package2 className="mr-2 h-4 w-4" />
              Manage products
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="transition hover:-translate-y-px hover:shadow-sm"
          >
            <Link href="/orders">
              View all orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </>
        ) : hasError ? (
          <div className="col-span-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load dashboard data. Please try again.
          </div>
        ) : (
          <>
            <motion.div
              variants={kpiCardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.25, delay: 0.02 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/5 via-background to-background/80 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Total products
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Package2 className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Available in your catalog
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={kpiCardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.25, delay: 0.06 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-emerald-500/5 via-background to-background/80 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-emerald-500/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Total users
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <Users className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered customers
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={kpiCardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-blue-500/5 via-background to-background/80 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-blue-500/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Total orders
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all customers
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={kpiCardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.25, delay: 0.14 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-purple-500/5 via-background to-background/80 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-purple-500/10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    Items volume
                  </CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                    <Layers className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-semibold">
                    {totalOrderQuantity}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total items ordered
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Avg per order:{' '}
                    <span className="font-medium text-foreground">
                      {avgItemsPerOrder}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {!loading && !hasError && (
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent orders
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Latest activity from your store.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs transition hover:bg-muted"
              >
                <Link href="/orders">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No orders available.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order, index) => {
                    const createdDate = new Date(order.date);
                    const formattedDate = createdDate.toLocaleDateString();
                    return (
                      <motion.div
                        key={order.id}
                        variants={listItemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{
                          duration: 0.22,
                          delay: index * 0.03,
                        }}
                        whileHover={{
                          y: -1,
                          scale: 1.01,
                        }}
                        className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-xs transition-colors hover:bg-muted/70"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              #{order.id}
                            </Badge>
                            <span className="text-muted-foreground">
                              User ID:{' '}
                              <span className="font-medium">
                                {order.userId}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <span>{formattedDate}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                            <span>
                              {order.itemsCount} items · {order.totalQuantity}{' '}
                              qty
                            </span>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] transition hover:bg-background"
                        >
                          <Link href={`/orders?userId=${order.userId}`}>
                            View user orders
                          </Link>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Top categories
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Based on number of products.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No category data available.
                </p>
              ) : (
                topCategories.map((cat, index) => (
                  <motion.div
                    key={cat.category}
                    variants={listItemVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                      duration: 0.22,
                      delay: index * 0.04,
                    }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize">{cat.category}</span>
                      <span className="text-muted-foreground">
                        {cat.count} products
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-linear-to-r from-primary via-primary/80 to-primary/60"
                        style={{ width: `${cat.percent}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percent}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
