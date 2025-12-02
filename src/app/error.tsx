'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        className="flex max-w-md flex-col items-center text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <motion.div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </motion.div>

        <h2 className="text-xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          You can retry the action or go back to the dashboard.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            className="inline-flex items-center justify-center gap-2"
            onClick={reset}
          >
            <RotateCw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="inline-flex items-center justify-center gap-2"
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
