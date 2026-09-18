import * as store from "../store.js";
import { todayStr, expectedWeight } from "../plan.js";

export async function renderWeight(view) {
  const profile = await store.getProfile();
  const ws = await store.weightsAll();
  view.innerHTML = `<div class="card"><h2>体重曲线</h2>
    ${ws.length < 2 ? '<div class="muted">至少记录 2 次体重后显示曲线（可在「今日」页记录）</div>' : chart(ws, profile)}
    <div class="muted" style="margin-top:8px">
      当前 ${ws.length ? ws[ws.length - 1].kg : "—"}kg · 目标 70kg · 今日目标线 ${expectedWeight(todayStr(), profile).toFixed(1)}kg
    </div>
  </div>
  <div class="card"><h2>历史记录</h2>
    ${ws.map((w) => `<div class="list-item"><span>${w.date}</span><span>${w.kg}kg</span></div>`).join("") || '<div class="muted">空</div>'}
  </div>`;
}

function chart(ws, profile) {
  const W = 320, H = 160, pad = 24;
  const all = ws.map((w) => ({ d: w.date, kg: w.kg, exp: expectedWeight(w.date, profile) }));
  const kgs = all.flatMap((p) => [p.kg, p.exp]);
  const min = Math.min(...kgs) - 1, max = Math.max(...kgs) + 1;
  const x = (i) => pad + (W - 2 * pad) * (all.length === 1 ? 0.5 : i / (all.length - 1));
  const y = (v) => H - pad - (H - 2 * pad) * (v - min) / (max - min);
  const line = (key) => all.map((p, i) =>
    `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%">
    <path d="${line("kg")}" fill="none" stroke="#1f8a4c" stroke-width="2.5"/>
    <path d="${line("exp")}" fill="none" stroke="#999" stroke-width="1.5" stroke-dasharray="4 3"/>
    ${all.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.kg)}" r="3" fill="#1f8a4c"/>`).join("")}
    <text x="${pad}" y="${pad - 8}" font-size="10" fill="#666">max ${max.toFixed(1)}</text>
    <text x="${pad}" y="${H - 4}" font-size="10" fill="#666">min ${min.toFixed(1)}</text>
  </svg>
  <div class="muted">绿线=实际体重，虚线=目标线</div>`;
}
