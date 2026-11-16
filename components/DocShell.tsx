"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DocsNav, type Anchor } from "@/components/site/docs-nav";
import { LabCredit, SiteBrand } from "@/components/site/brand";
import { ThemeToggle } from "@/components/site/theme";
import { Badge } from "@/components/ui/badge";

const GITHUB = "https://github.com/elicitjs/elicitjs";

type Props = {
  children: ReactNode;
  /** Drop the site sidebar and let `main` fill the width. The playground's
   * dashboard is a full-screen surface with its own left-rail navigation, so a
   * second site nav beside it only competes for space. */
  chromeless?: boolean;
};

/**
 * The page frame for every docs route.
 *
 * ≥ lg: a sticky sidebar (brand, page list, links) beside the content.
 * < lg: a sticky top bar; the same page list opens in a sheet.
 *
 * Desktop deliberately has no sticky header: the library's browser gate drags
 * charts at viewport coordinates, and a bar over the page could cover them.
 */
export function DocShell({ children, chromeless }: Props) {
  const pathname = usePathname() || "/";
  const active = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const [open, setOpen] = useState(false);

  // A page's sections are <Section> elements inside its own MDX tree, so the
  // shell can't know them at render time — it reads them back after mount.
  // ApiReference emits <section id="api"> too, so the API anchor comes along in
  // document order for free.
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  useEffect(() => {
    const nodes = document.querySelectorAll("main section[id]");
    setAnchors(
      Array.from(nodes).map((n) => ({
        id: n.id,
        title:
          n.id === "api"
            ? "API reference"
            : n.querySelector("h2")?.textContent?.trim() || n.id,
      }))
    );
  }, [pathname]);

  const current = useCurrentSection(anchors);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  if (chromeless) {
    return (
      <div className="layout-chromeless">
        <main className="main-chromeless docs-content">{children}</main>
      </div>
    );
  }

  const nav = (onNavigate?: () => void) => (
    <DocsNav active={active} anchors={anchors} current={current} onNavigate={onNavigate} />
  );

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      {/* ── Mobile / tablet top bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-5 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(20rem,85vw)] gap-0 bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Documentation pages</SheetDescription>
            <div className="flex h-14 items-center border-b border-sidebar-border px-5">
              <SiteBrand onNavigate={() => setOpen(false)} />
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <div className="pt-4">{nav(() => setOpen(false))}</div>
            </ScrollArea>
            <SidebarFooter />
          </SheetContent>
        </Sheet>
        <SiteBrand />
        <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
          alpha
        </Badge>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/api">API</Link>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={GITHUB} aria-label="GitHub repository">
              <GitHubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-svh flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SiteBrand />
              <Badge variant="secondary" className="h-[1.15rem] px-1.5 text-[0.65rem]">
                alpha
              </Badge>
            </div>
            <div className="-mr-1.5 flex items-center">
              <Button variant="ghost" size="icon-sm" asChild>
                <a href={GITHUB} aria-label="GitHub repository" className="text-sidebar-foreground">
                  <GitHubIcon />
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
          <p className="mt-1.5 pl-8 text-[0.74rem] text-muted-foreground">
            Declarative visual elicitation
          </p>
        </div>
        <ScrollArea className="min-h-0 flex-1">{nav()}</ScrollArea>
        <SidebarFooter />
      </aside>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="docs-content mx-auto w-full max-w-[1200px] min-w-0 px-4 pt-6 pb-24 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
        {children}
      </main>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-sidebar-border px-5 py-3.5">
      <LabCredit />
    </div>
  );
}

/** Tracks which page section is under the top of the viewport. */
function useCurrentSection(anchors: Anchor[]) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!anchors.length) return;
    const els = anchors
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => !!el);
    const pick = () => {
      const line = window.innerHeight * 0.3;
      let id: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) id = el.id;
      }
      setCurrent(id ?? els[0]?.id ?? null);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [anchors]);
  return current;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className ?? "size-4"}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
