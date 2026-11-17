import type { ApiEntry } from '../../lib/types';

export const api: ApiEntry[] = [
  {
    name: "compile(json, options?)",
    json: false,
    summary: (
      <>
        Turns a JSON spec into the spec <code className="inline">Elicit()</code>, <code className="inline">Elicit.dataset()</code> or <code className="inline">ds.chart()</code> takes. It throws, with the path into the JSON, for an unknown keyword, an unregistered function or an expression it cannot read.
      </>
    ),
    signatures: ["compile(json, { functions? }) → ElicitSpec"],
    options: [
      {
        name: "functions",
        type: "Record<string, Function>",
        default: "{}",
        desc: (
          <>
            The functions the spec names with <code className="inline">{'{ "fn": "<name>" }'}</code>. A name here wins over one set with <code className="inline">registerFunction</code>.
          </>
        ),
      },
    ],
    returns: "A spec. It builds one chart, so compile again for another.",
  },
  {
    name: "registerFunction(name, fn)",
    json: false,
    summary: (
      <>
        Registers a function for every later <code className="inline">compile()</code>. Registering a name again replaces it.
      </>
    ),
    signatures: ["registerFunction(name, fn) → void"],
  },
  {
    name: "recorder(options?)",
    json: false,
    summary: (
      <>
        Writes a spec built in JavaScript as JSON. It returns the namespaces <code className="inline">plot</code>, <code className="inline">elements</code>, <code className="inline">edit</code>, <code className="inline">constraints</code>, <code className="inline">guides</code>, <code className="inline">widgets</code> and <code className="inline">format</code>. Build the spec from them, then call <code className="inline">toJSON(spec)</code>.
      </>
    ),
    signatures: [
      "recorder({ functions? }) → Recorder",
      "recorder.toJSON(spec) → { json, functions }",
    ],
    options: [
      {
        name: "functions",
        type: "Record<string, Function>",
        default: "{}",
        desc: "Names for the functions the spec uses. A function left out is named after its option.",
      },
    ],
  },
];
