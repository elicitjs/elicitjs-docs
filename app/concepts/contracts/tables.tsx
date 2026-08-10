/** Contract matrices — plain JSX tables (MDX has no remark-gfm). */
export function KindsTable() {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>Kind</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>data</b></td>
            <td>Views dataset rows; channels name columns</td>
          </tr>
          <tr>
            <td><b>parametric</b></td>
            <td>Belief parameters (trend); not free create targets</td>
          </tr>
          <tr>
            <td><b>map chrome</b></td>
            <td>Basemap / tiles; pointer-transparent</td>
          </tr>
          <tr>
            <td><b>element</b></td>
            <td>
              Views a SCALE (<code className="inline">views: &apos;scale&apos;</code>); domain
              edits, not row creates
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function DataMarksTable() {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>Factory</th>
            <th>create/remove</th>
            <th>What you grab</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className="inline">point</code></td>
            <td>natural</td>
            <td>the mark</td>
          </tr>
          <tr>
            <td>
              <code className="inline">bar</code> / <code className="inline">barX</code> /{' '}
              <code className="inline">barY</code>
            </td>
            <td>remove ok; create awkward</td>
            <td>the bar</td>
          </tr>
          <tr>
            <td>
              <code className="inline">rect</code> / <code className="inline">rectX</code> /{' '}
              <code className="inline">rectY</code>
            </td>
            <td>natural</td>
            <td>
              the rect (<code className="inline">brushRect</code> zones)
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">tick</code> / <code className="inline">tickX</code> /{' '}
              <code className="inline">tickY</code>
            </td>
            <td>natural</td>
            <td>the tick</td>
          </tr>
          <tr>
            <td><code className="inline">ellipse</code></td>
            <td>natural</td>
            <td>
              the mark; <code className="inline">rx</code> and <code className="inline">ry</code> are
              separate magnitudes
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">curve</code> / <code className="inline">curveX</code> /{' '}
              <code className="inline">curveY</code>
            </td>
            <td>less natural</td>
            <td>a fat transparent hit path over the stroke</td>
          </tr>
          <tr>
            <td>
              <code className="inline">text</code> / <code className="inline">textX</code> /{' '}
              <code className="inline">textY</code>
            </td>
            <td>
              create awkward; use <code className="inline">editText</code>
            </td>
            <td>the label</td>
          </tr>
          <tr>
            <td>
              <code className="inline">line</code> / <code className="inline">area</code> (+ X/Y)
            </td>
            <td>
              natural (<code className="inline">edit.line.*</code>)
            </td>
            <td>per-datum / edge circles</td>
          </tr>
          <tr>
            <td>
              <code className="inline">rule</code> / <code className="inline">ruleX</code> /{' '}
              <code className="inline">ruleY</code>
            </td>
            <td>less natural</td>
            <td>the segment when edited</td>
          </tr>
          <tr>
            <td><code className="inline">dotStack</code></td>
            <td>natural (canonical)</td>
            <td>tokens</td>
          </tr>
          <tr>
            <td><code className="inline">waffle</code></td>
            <td>
              N/A → <code className="inline">edit.waffle.fill</code>
            </td>
            <td>cells</td>
          </tr>
          <tr>
            <td><code className="inline">needle</code></td>
            <td>N/A</td>
            <td>
              hub + path (<code className="inline">handles</code> contract)
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">arc</code> / <code className="inline">pie</code> /{' '}
              <code className="inline">donut</code>
            </td>
            <td>
              <code className="inline">edit.stack.cut</code> /{' '}
              <code className="inline">edit.stack.merge</code>
            </td>
            <td>rim boundary dots</td>
          </tr>
          <tr>
            <td><code className="inline">composite</code></td>
            <td>depends on parts</td>
            <td>each part is its own feature</td>
          </tr>
          <tr>
            <td><code className="inline">group</code></td>
            <td>depends on parts</td>
            <td>
              each part is its own feature, placed in a per-datum <b>local frame</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ParametricTable() {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>Factory</th>
            <th>Notes</th>
            <th>Affordance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className="inline">trend</code></td>
            <td>
              x/y are <b>axes</b>; intercept/slope are params
            </td>
            <td>
              circles at <code className="inline">anchor</code> / <code className="inline">probe</code>
            </td>
          </tr>
          <tr>
            <td><code className="inline">trendBand</code></td>
            <td>
              <code className="inline">handles</code> defaults <b>false</b> (line usually owns edits)
            </td>
            <td>opt-in spread handles</td>
          </tr>
          <tr>
            <td><code className="inline">face</code></td>
            <td>
              a <b>preset</b>, not a mark: it returns a <code className="inline">group</code> of
              ordinary marks. Emotion preset binds valence/arousal if unbound
            </td>
            <td>
              <b>shape is the control</b> — each feature is its own mark, so the universal edits
              apply and there is no <code className="inline">edit.face.*</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function GeoTable() {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>Factory</th>
            <th>Kind</th>
            <th>create/remove</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code className="inline">geoPoint</code> / <code className="inline">geoLine</code> /{' '}
              <code className="inline">geoPolygon</code> / <code className="inline">geoRect</code> /{' '}
              <code className="inline">geoText</code>
            </td>
            <td>data</td>
            <td>
              natural (<code className="inline">edit.geo.*</code>)
            </td>
          </tr>
          <tr>
            <td>
              <code className="inline">geoBasemap</code> / <code className="inline">geoTile</code>
            </td>
            <td>map chrome</td>
            <td>N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function ElementsTable() {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>Factory</th>
            <th>Edits</th>
            <th>Handles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code className="inline">axis</code> / <code className="inline">axisX</code> /{' '}
              <code className="inline">axisY</code>
            </td>
            <td>
              <code className="inline">edit.axis.scale</code> / <code className="inline">categories</code>
            </td>
            <td>domain end grips / category labels</td>
          </tr>
          <tr>
            <td>
              <code className="inline">grid</code> / <code className="inline">gridX</code> /{' '}
              <code className="inline">gridY</code>
            </td>
            <td>none</td>
            <td>—</td>
          </tr>
          <tr>
            <td>
              <code className="inline">legend</code> / …
            </td>
            <td>
              <code className="inline">edit.legend</code> / <code className="inline">legendValue</code>
            </td>
            <td>ramp grip / swatches</td>
          </tr>
          <tr>
            <td><code className="inline">axisRadial</code></td>
            <td>domain editing out of scope</td>
            <td>inert; optional x/y placement for per-row rings</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
