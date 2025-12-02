'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore } from '@/core/store/cart.store';
import { navItems } from '@/const/route';
import { motion } from 'framer-motion';
import { Logo } from './logo';

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const goToCart = () => router.push('/purchases');

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ x: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold shadow-sm"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <Logo withText={false} />
          </motion.div>
        </motion.div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{ y: -1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <Link
                href={item.href}
                className={`relative text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="topbar-active-underline"
                    className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative transition hover:bg-primary/10"
              onClick={goToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={cartCount}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </Button>
          </motion.div>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-60">
              <SheetHeader>
                <SheetTitle className="text-left font-semibold">
                  Navigation
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors ${
                      isActive(item.href)
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={goToCart}
                  className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {cartCount} item{cartCount > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
