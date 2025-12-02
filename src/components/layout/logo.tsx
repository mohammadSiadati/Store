'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  withText?: boolean;
  className?: string;
}

export function Logo({ withText = true, className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2 group', className)}
    >
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary/15 group-hover:shadow-sm">
        <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5">
          <rect
            x="6"
            y="10"
            width="20"
            height="14"
            rx="3"
            className="fill-primary/80"
          />
          <path
            d="M11 12.5C11 9.5 13 7 16 7C19 7 21 9.5 21 12.5"
            className="stroke-primary-foreground"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="13" cy="17" r="1.1" className="fill-primary-foreground" />
          <circle cx="19" cy="17" r="1.1" className="fill-primary-foreground" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-wide">
            Shopping Store
          </span>
          <span className="text-[11px] text-muted-foreground">
            Admin dashboard
          </span>
        </div>
      )}
    </Link>
  );
}
