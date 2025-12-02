'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOrdersQuery } from '@/features/orders/api/queries';
import type { Order } from '@/features/orders/api/types';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Package2,
  User2,
  CircleDot,
} from 'lucide-react';

type OrderDetailPageProps = {
  params: { id: string };
};

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const orderId = Number(params.id);

  const { data, isLoading, isError } = useOrdersQuery();

  const order = useMemo<Order | undefined>(
    () => data?.find((o) => o.id === orderId),
    [data, orderId]
  );

  const getStatus = (o: Order) => {
    const m = o.id % 3;
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

  const handleBack = () => {
    router.push('/orders');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Card className="rounded-2xl border bg-card/60 backdrop-blur-sm">
          <div className="space-y-4 p-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Button
          size="sm"
          variant="ghost"
          className="inline-flex items-center gap-2 px-0 text-xs"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Button>
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load order details.
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Button
          size="sm"
          variant="ghost"
          className="inline-flex items-center gap-2 px-0 text-xs"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Button>
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Order not found.
        </div>
      </div>
    );
  }

  const status = getStatus(order);
  const statusColor = getStatusColor(status);

  const createdAt = formatDate(order.date);
  const estimatedAt = getEstimatedDate(order.date);
  const prettyId = `ORD-${order.id.toString().padStart(4, '0')}`;

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Package2 className="h-3 w-3" />
            Order details
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Order #{order.id}
            </h1>
            <p className="text-xs text-muted-foreground">
              {prettyId} · User ID {order.userId}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {order.itemsCount} items · {order.totalQuantity} total quantity
          </p>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="inline-flex items-center gap-2 text-xs transition hover:bg-muted/80"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Button>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader className="flex flex-col gap-4 border-b bg-linear-to-r from-background via-background to-primary/5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">Summary</CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <User2 className="h-3 w-3" />
                  User ID: {order.userId}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Created: {createdAt}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Est. delivery: {estimatedAt}
                </span>
              </div>
            </div>
            <Badge
              variant={getStatusBadgeVariant(status)}
              className={`flex items-center gap-1 text-[11px] ${statusColor}`}
            >
              <CircleDot className="h-3 w-3" />
              {status}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-4 pt-5">
            {/* Top stats row */}
            <div className="grid gap-3 text-xs md:grid-cols-3">
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">
                  Order identifier
                </div>
                <div className="text-sm font-medium">{prettyId}</div>
              </div>
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">
                  Items & quantity
                </div>
                <div className="text-sm font-medium">
                  {order.itemsCount} items · {order.totalQuantity} qty
                </div>
              </div>
              <div className="rounded-lg border bg-muted/40 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Dates</div>
                <div className="text-[11px]">
                  Created: <span className="font-medium">{createdAt}</span>
                </div>
                <div className="text-[11px]">
                  Est. delivery:{' '}
                  <span className="font-medium">{estimatedAt}</span>
                </div>
              </div>
            </div>

            {/* Status timeline */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Status timeline
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                {['Pending', 'Processing', 'Delivered'].map((step, index) => {
                  const activeIndex =
                    status === 'Pending' ? 0 : status === 'Processing' ? 1 : 2;
                  const isActive = index <= activeIndex;

                  return (
                    <div
                      key={step}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div className="flex w-full items-center gap-1">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < 2 && (
                          <div
                            className={`h-0.5 flex-1 rounded-full ${
                              index < activeIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`mt-1 ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info box */}
            <div className="rounded-lg border border-dashed bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
              This demo API does not expose individual line items. In a real
              application, you would render a detailed list of products in this
              order with quantity, price and subtotal per item.
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start justify-between gap-3 border-t bg-muted/40 px-6 py-4 text-xs text-muted-foreground md:flex-row md:items-center">
            <div>
              <div>Order ID: #{order.id}</div>
              <div className="text-[11px]">
                Created at {createdAt} · Estimated delivery {estimatedAt}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="inline-flex items-center gap-2 text-xs transition hover:bg-background"
              onClick={handleBack}
            >
              <ArrowLeft className="h-3 w-3" />
              Back to orders
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
