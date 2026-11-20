// Page prose. `howToRead`, `analysisBody` and `beyondBody` are HTML; the leads are
// inline markdown.
window.GALLERY_TEXT = {
  overview:
    'This site walks every example in the Vega-Lite and Observable Plot galleries and asks two questions of each. ' +
    'Can **ElicitJS** draw it? And if it can, what could you **ask** with it? ' +
    'Each page shows the original (rendered live from its own spec or notebook), the ElicitJS recreation, ' +
    'and one or more elicitation interfaces: live charts whose gestures write the reader’s answer back to data.',

  howToRead: `
<h3>How to read a page</h3>
<p><b>Original.</b> The upstream example, rendered live: Vega-Lite specs through <code>vega-embed</code>,
Plot notebooks through the Observable runtime. Its code is under the chart.</p>
<p><b>ElicitJS recreation.</b> The same chart as an ElicitJS spec, built from the library’s ordinary marks.
ElicitJS has no transform layer, so aggregation, binning and the like are computed in plain JavaScript first;
the page lists those under <i>Computed outside the spec</i>.</p>
<p><b>Elicitation interfaces.</b> One tab per way of asking a question with that chart. Each is live:
drag, click or draw, and the <code>getData()</code> panel shows the rows your gesture wrote.
In the spec, <span style="background:#fff6d6;box-shadow:inset 3px 0 0 #f59e0b;padding:0 6px">highlighted lines</span>
are the ones that make it an elicitation — the edits, constraints, locks and schema choices you would change to change the question.</p>
<h3>Outcomes</h3>
<ul>
<li><b>Recreated</b> — the form and encodings are reproduced; differences are cosmetic.</li>
<li><b>Partly recreated</b> — the core chart is there, but something a reader would notice is missing (listed on the page).</li>
<li><b>Not supported</b> — it can’t be built from ElicitJS’s existing marks without writing new ones. The page names the missing features.</li>
</ul>
<p>The <a href="#/analysis">outcome analysis</a> aggregates the gaps and ranks the missing features by how many examples each would unlock.
<a href="#/beyond">Beyond the two libraries</a> shows interfaces neither library can express, because in both a chart is an output.</p>
`,

  beyondBody: `
<p>Every capability below follows from one design choice: <b>an edit is the inverse of an encoding</b>.
A drag runs back through the same scale that drew the mark. In Vega-Lite and Plot a chart is a function of
data you already have. In ElicitJS the chart is also the input, and that opens up six things neither can do:</p>
<ol>
<li><b>Gestures that write rows.</b> Move, slide, rotate, resize, rank, draw and sweep each invert a channel into a column.
<i>(Rank by dragging, A needle for likelihood, Pin it.)</i></li>
<li><b>Gestures that create and delete rows</b>, and with them whole series, tokens, notes and nodes.
<i>(Twenty chips, Several futures, A risk matrix of sticky notes.)</i></li>
<li><b>A schema that can grow.</b> Open domains, minted categories, and renaming from the legend.
<i>(Grow the vocabulary.)</i></li>
<li><b>Rules that repair.</b> Constraints gate or fix every proposal, whichever mark it came from: a budget, an ordering, a cap.
<i>(Twenty chips, Best guess first.)</i></li>
<li><b>Glyphs with their own frame</b>, where every feature is an ordinary editable channel. <i>(A face per outlook.)</i></li>
<li><b>Structure as data.</b> Networks with referential integrity; trends, bands and uncertainty as columns; protocols as stages.
<i>(Draw the causes, A line and how sure you are, Best guess first.)</i></li>
</ol>
<h3>More ideas this makes possible</h3>
<ul>
<li><b>Joint distributions by painting.</b> A 2-D grid of cells you paint with probability mass, where <code>maintainSum</code> keeps the total at 100%.</li>
<li><b>Hypothetical outcomes.</b> Ask for several sampled futures rather than one line, then compare their spread to the stated interval.</li>
<li><b>Calibration training.</b> A staged guess → reveal → score loop, with a guide that scores each answer against the truth.</li>
<li><b>Card sorting.</b> Select items, then click a legend category to file them; open domains let people invent the categories.</li>
<li><b>Probability trees.</b> A directed network whose link weights are elicited and constrained to sum to 1 at each node.</li>
<li><b>Planning as elicitation.</b> Gantt bars whose spans you brush, with <code>ordering</code> constraints for dependencies, so the plan is the answer.</li>
<li><b>Affect over time.</b> One face per day on a time axis, as a diary instrument that needs no words.</li>
<li><b>Maps of belief.</b> A region drawn with <code>edit.geo.draw</code>, plus a confidence ring per pin, plus a route through the places you would visit.</li>
<li><b>Correlation without numbers.</b> A pinned <code>trend</code> whose slope is the elicited correlation, with a band for how sure you are.</li>
</ul>
`,

  beyondLead:
    'Vega-Lite and Plot are grammars for drawing data you have. ElicitJS is a grammar for collecting data you don’t: every gesture runs an encoding backwards, so the chart is the input. These interfaces have no equivalent in either library.',
};
