// registry.js — the one global the entry files write into.
//
// An entry file is a classic script that calls GALLERY.add({...}) once per
// upstream example, and GALLERY.beyond({...}) for the "beyond" showcase. Loading
// order does not matter: the app reads the registry after every script has run.
(function () {
  const entries = {};
  const beyond = [];
  window.GALLERY = {
    entries,
    beyondList: beyond,
    add(e) {
      if (!e || !e.id) throw new Error('GALLERY.add: entry needs an id');
      if (entries[e.id]) console.warn('[gallery] duplicate entry id', e.id);
      entries[e.id] = e;
    },
    beyond(e) { beyond.push(e); },
    // Feature-gap vocabulary, so the analysis page can count what is missing.
    // An entry's `needs` names keys from this table; unknown keys still render.
    features: {},
    defineFeatures(map) { Object.assign(this.features, map); },
  };
})();
