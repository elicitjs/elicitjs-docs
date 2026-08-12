import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react';

/**
 * Markdown → the docs' existing DOM. Prose is authored in `app/**\/page.mdx`;
 * these mappings keep it landing on the class names `styles/docs.css` already
 * targets, so the migration needed no CSS change.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // `foo` → <code class="inline">, the docs' inline-code style. A fenced block
    // arrives with className="language-*" and must keep it, so only classless —
    // i.e. inline — code gets the class.
    code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
      <code className={className ?? 'inline'} {...props} />
    ),
    // Prose fences (` ```js `) share the dark `.code` panel used by live examples.
    pre: ({ children, ...props }: HTMLAttributes<HTMLPreElement>) => (
      <pre className="code" {...props}>
        {children}
      </pre>
    ),
    // Internal links route through next/link; external ones stay plain anchors.
    a: ({ href = '', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) =>
      href.startsWith('/') ? (
        <Link href={href} {...props} />
      ) : (
        <a href={href} {...props} />
      ),
    ...components,
  };
}
