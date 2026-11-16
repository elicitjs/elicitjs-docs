import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Raleway } from 'next/font/google';
import { ThemeProvider } from '@/components/site/theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import './globals.css';

// Body and UI text.
const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
// Code, data readouts, API names.
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
// Headings: the Data & Dialogue Lab logo's typeface.
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });

export const metadata: Metadata = {
  title: 'Elicit.js Docs',
  description: 'Declarative visual elicitation — documentation',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1a28' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geistSans.variable, geistMono.variable, raleway.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
