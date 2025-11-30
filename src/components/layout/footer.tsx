'use client';

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6 text-sm text-muted-foreground">
        {/* Left: Copyright */}
        <p className="text-xs">
          © {new Date().getFullYear()} Your Dashboard. All rights reserved.
        </p>

        {/* Right: Links */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hover:text-foreground transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-foreground transition-colors duration-200"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-foreground transition-colors duration-200"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
