'use client';

import { motion } from 'framer-motion';

export default function LoadingPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-background shadow-sm"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 0.9,
            ease: 'linear',
          }}
        >
          <motion.div
            className="h-7 w-7 rounded-full border-2 border-primary/30 border-t-primary"
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: 0.9,
              ease: 'linear',
            }}
          />
        </motion.div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Loading your dashboard
          </p>
          <p className="text-xs text-muted-foreground">
            Fetching the latest data. This won&apos;t take long.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
