'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductsQuery } from '@/features/products/api/queries';
import type { Product } from '@/features/products/api/types';

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
import { ShoppingCart } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useProductsQuery();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // فیلتر محصولات
  const filteredProducts = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;

    const term = search.toLowerCase();

    return data.filter((product: Product) => {
      return (
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    });
  }, [data, search]);

  // با تغییر سرچ، همیشه برگرد صفحه ۱
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, pageSize]);

  const goToCart = (productId: number) => {
    router.push(`/cart?productId=${productId}`);
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Discover products and add them to the cart with one click.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Card key={i} className="overflow-hidden backdrop-blur">
              <Skeleton className="h-40 w-full" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load products.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filteredProducts.length === 0 && (
        <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          No products match your search.
        </div>
      )}

      {/* Product grid + pagination */}
      {!isLoading && !isError && filteredProducts.length > 0 && (
        <>
          {/* Grid of cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.map((product) => (
              <Card
                key={product.id}
                onClick={() => goToCart(product.id)}
                className="group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Header */}
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-tight transition-colors group-hover:text-primary">
                      {product.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] capitalize"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>

                {/* Image */}
                <CardContent className="px-4 pb-0">
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-36 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </CardContent>

                {/* Description + Price */}
                <CardContent className="space-y-3 p-4">
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="border-t bg-muted/40 p-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="
                      flex w-full items-center justify-center gap-2 text-xs
                      transition-colors
                      group-hover:bg-primary group-hover:text-amber-400
                    "
                    onClick={(e) => {
                      e.stopPropagation();
                      goToCart(product.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} · {filteredProducts.length}{' '}
                products
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Prev
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const p = index + 1;
                    return (
                      <Button
                        key={p}
                        size="sm"
                        variant={p === currentPage ? 'default' : 'outline'}
                        className="h-8 w-8 px-0 text-xs"
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
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
