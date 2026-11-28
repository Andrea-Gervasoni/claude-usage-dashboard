// Storia di esempio, deterministica: serve alla demo pubblica e a chi vuole provare senza dati.
// Stessi input, stesso output. I numeri sono inventati e la pagina lo dichiara.
export function sampleHistory(endDate = new Date(), nDays = 230) {
  let s = 0x9e3779b9; const rnd = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const MODELS = [["claude-opus-5-5", .6, 1.6e-6], ["claude-sonnet-5-5", .3, .4e-6], ["claude-haiku-4-5-20251001", .1, .1e-6]];
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const days = {};
  for (let k = nDays; k >= 0; k--) {
    const d = new Date(endDate); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - k);
    if (rnd() < (d.getDay() % 6 === 0 ? .25 : .12) && k > 0) continue;
    const scale = (.2 + rnd() * 1.2) * (1 + (nDays - k) / nDays), models = [];
    for (const [name, share, price] of MODELS) {
      if (name !== MODELS[0][0] && rnd() < .25) continue;
      const cr = Math.floor(scale * share * (.7 + rnd() * .6) * 9e6), cc = Math.floor(cr * .07), o = Math.floor(cr * .012), i = Math.floor(cr * .0004);
      models.push({ model: name, input: i, output: o, cacheCreation: cc, cacheRead: cr, cost: cr * price + cc * price * 12 + o * price * 50 });
    }
    const sum = (f) => models.reduce((a, m) => a + m[f], 0), day = { input: sum("input"), output: sum("output"), cacheCreation: sum("cacheCreation"), cacheRead: sum("cacheRead"), cost: sum("cost"), models };
    day.total = day.input + day.output + day.cacheCreation + day.cacheRead; days[iso(d)] = day;
  }
  return { version: 1, updatedAt: new Date().toISOString(), days };
}
