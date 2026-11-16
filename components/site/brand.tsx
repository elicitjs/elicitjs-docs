import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * The Elicit.js mark: a bar being dragged to an answer. Drawn from tokens, so
 * it follows the palette in styles/brand.css and both colour modes.
 */
export function ElicitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-6 shrink-0', className)}>
      <rect width="24" height="24" rx="6" fill="var(--blue-600)" />
      <rect x="5" y="12" width="3.4" height="7" rx="1" fill="var(--blue-300)" />
      <rect x="10.3" y="8" width="3.4" height="11" rx="1" fill="var(--teal-400)" />
      <rect x="15.6" y="14" width="3.4" height="5" rx="1" fill="var(--blue-300)" />
      <circle cx="12" cy="6.2" r="2.4" fill="white" stroke="var(--teal-400)" strokeWidth="1.4" />
    </svg>
  );
}

export function SiteBrand({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2 rounded-md text-foreground no-underline outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
    >
      <ElicitMark />
      <span className="font-heading text-[1.08rem] font-semibold tracking-tight">Elicit.js</span>
    </Link>
  );
}

/**
 * The lab credit: the Data & Dialogue Lab logo, lifted for dark backgrounds.
 * Wrap it in a link once the lab has a public URL.
 */
export function LabCredit({ className }: { className?: string }) {
  return (
    <div className={cn('group flex items-center justify-between gap-3', className)}>
      <span className="text-[0.68rem] leading-tight font-medium tracking-wide text-faint-foreground uppercase">
        A project of
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimiser */}
      <img
        src="/brand/data-dialogue-lab.png"
        alt="Data & Dialogue Lab"
        width={536}
        height={328}
        className="h-auto w-[4.5rem] opacity-90 transition-opacity group-hover:opacity-100 dark:brightness-[1.9] dark:saturate-[0.7]"
      />
    </div>
  );
}
