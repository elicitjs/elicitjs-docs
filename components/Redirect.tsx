'use client';

import { useEffect } from 'react';

/**
 * A page that moved. GitHub Pages serves static files only, so there is no
 * server redirect: the old route stays a page that sends the reader on.
 *
 * `to` is the new route, with a trailing slash (the export emits one) and an
 * optional default `#section`. A hash the reader arrived with wins over it, which
 * is why merged pages keep their old section ids: `/editing/zoom#pan` lands on
 * `/editing/axis/#pan`.
 *
 * The meta refresh covers readers without JavaScript; it cannot carry the hash.
 */
export function Redirect({ to }: { to: string }) {
  useEffect(() => {
    const [path, fallback] = to.split('#');
    const hash = window.location.hash || (fallback ? `#${fallback}` : '');
    window.location.replace(path + hash);
  }, [to]);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <meta name="robots" content="noindex" />
      <p style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        This page has moved to <a href={to}>{to}</a>.
      </p>
    </>
  );
}
