// Livelli di aura: una sola fonte di verità, usata dalla pagina (iniettata in fase di build)
// e dal badge SVG. Formula: +1 per milione di token, +50 per giorno della serie più lunga, +10 per giorno attivo.
export const LEVELS = [
  { n: 1, name: "NPC", at: 0, tag: "No aura detected. Touch keyboard." },
  { n: 2, name: "Vibe Rookie", at: 250, tag: "It compiles. Sometimes." },
  { n: 3, name: "Vibe Coder", at: 1000, tag: "Reads the diff? Never heard of it." },
  { n: 4, name: "Ship Machine", at: 2500, tag: "Pushes to main on a Friday." },
  { n: 5, name: "Context Lord", at: 5000, tag: "200K context, zero fear." },
  { n: 6, name: "Token Whale", at: 12000, tag: "Rate limits fear you." },
  { n: 7, name: "Final Boss", at: 30000, tag: "The model asks you for help." },
];

const dayTotal = (v) => v.total || (v.input || 0) + (v.output || 0) + (v.cacheCreation || 0) + (v.cacheRead || 0);
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };

export function computeAura(days) {
  let tot = 0, act = 0, best = 0, cur = 0, prev = null;
  for (const k of Object.keys(days).sort()) {
    const t = dayTotal(days[k]); tot += t;
    if (t <= 0) { cur = 0; prev = null; continue; }
    act++; cur = prev && Math.round((parse(k) - parse(prev)) / 864e5) === 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = k;
  }
  const pts = Math.floor(tot / 1e6) + 50 * best + 10 * act;
  let li = 0; LEVELS.forEach((l, i) => { if (pts >= l.at) li = i; });
  return { tot, act, best, pts, level: LEVELS[li], next: LEVELS[li + 1] || null };
}

// Badge SVG da mettere nel README del proprio profilo. Palette Cielo, nessun font esterno.
export function badgeSvg(a) {
  const left = "vibecrab", right = `Lv ${a.level.n}  ${a.level.name}  ${a.pts.toLocaleString("en-US")} aura`;
  const w = (s, k) => Math.round(s.length * k + 20), lw = w(left, 7.2) + 26, rw = w(right, 7.4);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lw + rw}" height="28" role="img" aria-label="${esc(left + ": " + right)}">
<title>${esc(left + ": " + right)}</title>
<clipPath id="r"><rect width="${lw + rw}" height="28" rx="8"/></clipPath>
<g clip-path="url(#r)"><rect width="${lw}" height="28" fill="#0F1B24"/><rect x="${lw}" width="${rw}" height="28" fill="#DC6A32"/></g>
<g fill="#DC6A32" transform="translate(9 6)"><rect x="3" y="1" width="12" height="7.5" rx="1.2"/><rect x="1" y="4" width="16" height="2.6" rx=".8"/><rect x="4" y="8.5" width="1.5" height="3"/><rect x="7" y="8.5" width="1.5" height="3"/><rect x="10.5" y="8.5" width="1.5" height="3"/><rect x="13" y="8.5" width="1.5" height="3"/></g>
<rect x="6.8" y="8.6" width="1.4" height="2.7" fill="#0F1B24" transform="translate(9 6) translate(-3.5 -3.5)"/>
<g font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" font-weight="600" text-anchor="start">
<text x="32" y="18.5" fill="#EAF1F5">${esc(left)}</text><text x="${lw + 10}" y="18.5" fill="#0F1B24">${esc(right)}</text></g></svg>
`;
}
