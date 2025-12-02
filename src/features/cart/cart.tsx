'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/core/store/cart.store';
import { usePurchaseStore } from '@/core/store/purchase.store';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();

  // گرفتن داده‌ها از Zustand
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = usePurchaseStore((state) => state.addOrder);

  const isEmpty = items.length === 0;
  const shipping = isEmpty ? 0 : 5;

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => Number((subtotal + shipping).toFixed(2)),
    [subtotal, shipping]
  );

  const goBackToProducts = () => {
    router.push('/products');
  };

  const handleQuantityChange = (productId: number, value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return;
    updateQuantity(productId, num <= 0 ? 1 : num);
  };

  const handleDecrease = (productId: number, current: number) => {
    updateQuantity(productId, Math.max(1, current - 1));
  };

  const handleIncrease = (productId: number, current: number) => {
    updateQuantity(productId, current + 1);
  };

  const handleCheckout = () => {
    if (isEmpty) return;

    // 1) ثبت سفارش در purchase store
    addOrder({
      items, // CartItem[]
      subtotal,
      shipping,
      total,
    });

    // 2) خالی کردن سبد
    clearCart();

    // 3) هدایت کاربر به صفحه لیست خریدها
    router.push('/purchases');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Cart</h2>
          <p className="text-sm text-muted-foreground">
            Review your cart items and proceed to checkout.
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

      {/* Empty state */}
      {isEmpty && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any items in your cart yet.
            </p>
            <Button onClick={goBackToProducts} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse products
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cart content */}
      {!isEmpty && (
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          {/* لیست محصولات سبد */}
          <div className="space-y-4">
            {items.map((item) => {
              const { product, quantity } = item;
              const lineTotal = product.price * quantity;

              return (
                <Card
                  key={product.id}
                  className="flex flex-col overflow-hidden"
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {product.title}
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Adjust quantity or remove this item.
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {product.category}
                    </Badge>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 border-t bg-muted/40 p-4 md:flex-row">
                    {/* تصویر */}
                    <div className="flex items-center justify-center md:w-1/4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-24 w-24 object-contain"
                      />
                    </div>

                    {/* اطلاعات + کنترل تعداد */}
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {product.description}
                        </p>
                        <p className="text-sm font-semibold">
                          Unit price: ${product.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Quantity
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleDecrease(product.id, quantity)
                              }
                            >
                              -
                            </Button>
                            <Input
                              className="h-7 w-16 text-center text-xs"
                              value={quantity}
                              onChange={(e) =>
                                handleQuantityChange(product.id, e.target.value)
                              }
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleIncrease(product.id, quantity)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        {/* Line total */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Line total
                          </span>
                          <span className="text-sm font-semibold">
                            ${lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-end border-t bg-background px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="inline-flex items-center gap-2 text-xs text-destructive hover:text-destructive"
                      onClick={() => removeItem(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* خلاصه سفارش */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Subtotal ({totalQuantity} item
                  {totalQuantity > 1 ? 's' : ''})
                </span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Total</span>
                  <span className="text-base font-semibold">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full text-sm" onClick={handleCheckout}>
                Proceed to checkout
              </Button>
              <p className="text-xs text-muted-foreground">
                This is a demo checkout. No real payment is processed.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
