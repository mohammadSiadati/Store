'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePurchaseStore } from '@/core/store/purchase.store';
import { useCartStore } from '@/core/store/cart.store';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CalendarDays,
  Package2,
  Pencil,
  Trash2,
} from 'lucide-react';

export default function PurchasesPage() {
  const router = useRouter();
  const orders = usePurchaseStore((state) => state.orders);
  const removeOrder = usePurchaseStore((state) => state.removeOrder);

  const setCartItems = useCartStore((state) => state.setItems);

  const isEmpty = orders.length === 0;

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders]
  );

  const totalOrders = orders.length;

  const goBackToProducts = () => {
    router.push('/products');
  };

  // ⬅️ Edit: سفارش رو دوباره تو سبد می‌ریزه و می‌بره /cart
  const handleEditOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setCartItems(order.items);
    router.push('/cart');
  };

  // ⬅️ Delete: حذف از لیست خریدها
  const handleDeleteOrder = (orderId: string) => {
    removeOrder(orderId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            My purchases
          </h2>
          <p className="text-sm text-muted-foreground">
            View and manage the orders you&apos;ve completed in this session.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={goBackToProducts}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Button>
      </div>

      {/* Summary */}
      {!isEmpty && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total orders</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              {totalOrders}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total spent</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              ${totalSpent.toFixed(2)}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              You haven&apos;t completed any purchases yet.
            </p>
            <Button onClick={goBackToProducts} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start shopping
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Orders list */}
      {!isEmpty && (
        <div className="space-y-4">
          {orders.map((order) => {
            const createdDate = new Date(order.createdAt);
            const formattedDate = createdDate.toLocaleString();

            const totalItems = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      Order {order.id}
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{formattedDate}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      <span>
                        {totalItems} item
                        {totalItems > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    ${order.total.toFixed(2)}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3 border-t bg-muted/40 p-4">
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 rounded-md bg-background/80 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-10 w-10 rounded-md object-contain"
                        />
                        <div>
                          <div className="line-clamp-1 font-medium">
                            {item.product.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="capitalize">
                              {item.product.category}
                            </span>
                            <span>·</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Unit: ${item.product.price.toFixed(2)}
                        </div>
                        <div className="text-sm font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="flex items-center justify-between bg-background px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package2 className="h-3 w-3" />
                    <span>
                      {order.items.length} product type
                      {order.items.length > 1 ? 's' : ''} in this order
                    </span>
                  </div>

                  {/* ⬇️ دکمه‌های Edit و Delete */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-[11px]"
                      onClick={() => handleEditOrder(order.id)}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-[11px] text-destructive hover:text-destructive"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
