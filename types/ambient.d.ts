declare module '*.css';
declare module 'd3';

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// `@elicit` resolves via tsconfig paths → ../elicitjs/src/index.js, which picks up
// ../elicitjs/src/index.d.ts. Do not re-declare the module here as `any` — that
// kills IntelliSense for Elicit / plot / edit.
