'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/nav';
import type { NavPage } from '@/lib/types';
import { cn } from '@/lib/utils';

export type Anchor = { id: string; title: string };

type Props = {
  /** The current route, trailing slash removed. */
  active: string;
  /** In-page sections of the active route, shown nested under it. */
  anchors: Anchor[];
  /** The section currently in view, highlighted among the anchors. */
  current: string | null;
  /** Called after a link is followed, so the mobile sheet can close. */
  onNavigate?: () => void;
};

/** The grouped page list, shared by the desktop sidebar and the mobile sheet. */
export function DocsNav({ active, anchors, current, onNavigate }: Props) {
  const activeRef = useRef<HTMLAnchorElement>(null);
  const showAnchors = anchors.length > 1 || anchors.some((a) => a.id === 'api');

  // Bring the active page into view inside the sidebar's own scroller, without
  // touching the window's scroll (scrollIntoView would move both).
  useEffect(() => {
    const link = activeRef.current;
    const viewport = link?.closest<HTMLElement>('[data-slot="scroll-area-viewport"]');
    if (!link || !viewport) return;
    const top = link.offsetTop - viewport.clientHeight / 3;
    viewport.scrollTop = Math.max(0, top);
  }, [active]);

  // Should a page ever sit in two groups, only its first entry is marked as the
  // current page and expands.
  let activeSeen = false;

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-5 px-3 pt-1 pb-6">
      {SITE.map((grp) => (
        <div key={grp.group}>
          <div className="mb-1 px-2.5 text-[0.68rem] font-semibold tracking-[0.08em] text-faint-foreground uppercase">
            {grp.group}
          </div>
          {runs(grp.pages).map((run, i) => {
            const list = (
              <ul className="flex flex-col gap-px">{run.pages.map(renderPage)}</ul>
            );
            if (!run.heading) return <div key={i}>{list}</div>;
            // A category inside a group: a coloured label with a rule after it,
            // and its pages indented on a guide line, so it never reads as a page.
            return (
              <div key={i} className="mt-3 first:mt-1">
                <div className="mb-1 flex items-center gap-2 px-2.5 text-[0.66rem] font-semibold tracking-[0.06em] text-sidebar-primary uppercase after:h-px after:flex-1 after:bg-sidebar-border">
                  {run.heading}
                </div>
                <div className="ml-2.5 border-l border-sidebar-border pl-1">{list}</div>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );

  function renderPage(p: NavPage) {
    const isActive = p.href === active && !activeSeen;
    if (isActive) activeSeen = true;
    const expand = isActive && showAnchors;
    return (
      <li key={p.href}>
        <Link
          ref={isActive ? activeRef : undefined}
          href={p.href}
          onClick={onNavigate}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'relative flex items-center rounded-md px-2.5 py-[0.3rem] text-[0.84rem] leading-snug text-sidebar-foreground no-underline transition-colors',
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            'outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50',
            isActive &&
              'bg-sidebar-accent font-medium text-sidebar-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand',
          )}
        >
          {p.title}
        </Link>
        {expand ? (
          <ul className="my-1 ml-3.5 flex flex-col border-l border-sidebar-border">
            {anchors.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  onClick={onNavigate}
                  className={cn(
                    '-ml-px block border-l py-1 pr-2 pl-3 text-[0.78rem] leading-snug [overflow-wrap:anywhere] no-underline transition-colors',
                    current === a.id
                      ? 'border-brand text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground',
                  )}
                >
                  {a.title}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </li>
    );
  }
}

/** Split a group's pages into runs, a new one at each page that carries a `heading`. */
function runs(pages: NavPage[]): { heading?: string; pages: NavPage[] }[] {
  const out: { heading?: string; pages: NavPage[] }[] = [];
  for (const p of pages) {
    if (p.heading || out.length === 0) out.push({ heading: p.heading, pages: [] });
    out[out.length - 1].pages.push(p);
  }
  return out;
}
