'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Ghost, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        className="flex max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <motion.div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted"
          initial={{ scale: 0.9, rotate: -3 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Ghost className="h-8 w-8 text-muted-foreground" />
        </motion.div>

        <div className="mb-2 inline-flex items-baseline gap-2">
          <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
            404
          </span>
          <span className="text-sm text-muted-foreground">Page not found</span>
        </div>

        <p className="mb-1 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <p className="mb-6 text-xs text-muted-foreground">
          Check the URL, or go back to a safe place in the dashboard.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="default"
            size="sm"
            className="inline-flex items-center justify-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="inline-flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
