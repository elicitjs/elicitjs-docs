'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { DocShell } from '../../components/DocShell';
import {
  API_INDEX,
  API_NAMESPACES,
  API_TOP_LEVEL,
  API_LIBRARY_VERSION,
  type ApiIndexEntry,
} from '../../lib/api-index.generated';

/**
 * The API index — every name in the grammar, in one searchable place.
 *
 * The data is GENERATED from the library (scripts/gen-api-index.mjs), so this
 * component only renders; it never encodes what exists. A new mark appears here
 * with no edit to this file, and nothing here can claim a function the library
 * does not export.
 *
 * Search matches a name, its namespace and its OPTION names, because "which mark
 * takes `handleSize`?" is the question an index is actually for.
 */
export default function ApiPage() {
  const [q, setQ] = useState('');
  const [ns, setNs] = useState<string | null>(null);

  const query = q.trim().toLowerCase();

  const matches = useMemo(() => {
    let rows: ApiIndexEntry[] = API_INDEX;
    if (ns) rows = rows.filter((e) => e.namespace === ns);
    if (!query) return rows;
    return rows.filter(
      (e) =>
        e.qualified.toLowerCase().includes(query) ||
        e.name.toLowerCase().includes(query) ||
        e.own.some((o) => o.toLowerCase().includes(query)),
    );
  }, [query, ns]);

  const grouped = useMemo(() => {
    const by = new Map<string, ApiIndexEntry[]>();
    for (const e of matches) {
      if (!by.has(e.group)) by.set(e.group, []);
      by.get(e.group)!.push(e);
    }
    return [...by.entries()];
  }, [matches]);

  return (
    <DocShell>
      <h1>API reference</h1>
      <p className="lead">
        Every name you can write in a spec: {API_INDEX.length} members across{' '}
        {API_NAMESPACES.length} namespaces, from{' '}
        <code className="inline">elicitjs@{API_LIBRARY_VERSION}</code>. Search matches
        option names as well as factory names, so{' '}
        <code className="inline">handleSize</code> finds every mark that takes it.
        Each entry links to the page documenting it.
      </p>

      <div className="api-controls">
        <input
          className="api-search"
          type="search"
          placeholder="Search names and options…  (move, handleSize, network)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search the API"
        />
        <div className="api-chips">
          <button
            type="button"
            className={`api-chip${ns === null ? ' on' : ''}`}
            onClick={() => setNs(null)}
          >
            all
          </button>
          {API_NAMESPACES.map((n) => (
            <button
              key={n.namespace}
              type="button"
              className={`api-chip${ns === n.namespace ? ' on' : ''}`}
              onClick={() => setNs(ns === n.namespace ? null : n.namespace)}
              title={n.blurb}
            >
              {n.namespace} <span className="api-chip-n">{n.count}</span>
            </button>
          ))}
        </div>
      </div>

      {query || ns ? (
        <p className="api-count">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          {ns ? (
            <>
              {' '}
              in <code className="inline">{ns}</code>
            </>
          ) : null}
        </p>
      ) : null}

      {grouped.length === 0 ? (
        <p className="intro">
          Nothing matches <code className="inline">{q}</code>. Try a mark (
          <code className="inline">bar</code>), an edit (
          <code className="inline">move</code>) or an option (
          <code className="inline">orientation</code>).
        </p>
      ) : null}

      {grouped.map(([group, rows]) => {
        const meta = API_NAMESPACES.find((n) => n.namespace === group);
        return (
          <section id={group.replace(/\./g, '-')} key={group}>
            <h2 className="section">
              <code className="inline">{group}</code>
            </h2>
            {meta ? <p className="intro">{meta.blurb}</p> : null}
            <div className="api-index-grid">
              {rows.map((e) => (
                <div className="api-index-item" key={e.qualified}>
                  <div className="api-index-head">
                    {e.docs ? (
                      <Link href={e.docs} className="api-index-name">
                        {e.qualified}
                      </Link>
                    ) : (
                      <span className="api-index-name">{e.qualified}</span>
                    )}
                    {e.docs ? (
                      <Link href={e.docs} className="api-index-docs">
                        {e.docs} →
                      </Link>
                    ) : (
                      <span className="api-index-nodocs">no page yet</span>
                    )}
                  </div>
                  {e.own.length ? (
                    <div className="api-index-opts">
                      {e.own.map((o) => (
                        <code
                          key={o}
                          className={`api-opt${
                            query && o.toLowerCase().includes(query) ? ' hit' : ''
                          }`}
                        >
                          {o}
                        </code>
                      ))}
                    </div>
                  ) : (
                    <div className="api-index-opts">
                      <span className="api-index-nodocs">
                        universal options only
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section id="top-level">
        <h2 className="section">Top-level exports</h2>
        <p className="intro">
          Imported from <code className="inline">elicitjs</code> directly, beside the
          namespaces above.
        </p>
        <div className="api-index-grid">
          {API_TOP_LEVEL.map((t) => (
            <div className="api-index-item" key={t.name}>
              <div className="api-index-head">
                {t.docs ? (
                  <Link href={t.docs} className="api-index-name">
                    {t.name}
                  </Link>
                ) : (
                  <span className="api-index-name">{t.name}</span>
                )}
                <span className="api-index-docs">{t.kind}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="authoring-note">
        <h2 className="section">Authoring kit</h2>
        <p className="intro">
          <code className="inline">elicitjs/authoring</code> —{' '}
          <code className="inline">encodeChannel</code>,{' '}
          <code className="inline">makeEdit</code>,{' '}
          <code className="inline">registerDriver</code> and the rest — is listed
          separately on <Link href="/authoring">Authoring SDK</Link>. Use it to build
          your own marks and edits. It is not spec vocabulary, so it is not indexed here.
        </p>
      </section>
    </DocShell>
  );
}
