import * as store from "../store.js";
import { todayStr, expectedWeight, planWeek, mondayOf } from "../plan.js";
import { buildDigest } from "../coach.js";
import { sumKcal } from "../food.js";

function ring(kcal, budget) {
  const r = 52, c = 2 * Math.PI * r;
  const ratio = Math.min(1, kcal / budget);
  const over = kcal > budget;
  return `<svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="#e5ece7" stroke-width="12"/>
    <circle cx="60" cy="60" r="${r}" fill="none" stroke="${over ? "#d64545" : "#1f8a4c"}"
      stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}"
      stroke-dashoffset="${c * (1 - ratio)}" transform="rotate(-90 60 60)"/>
    <text x="60" y="56" text-anchor="middle" font-size="18" font-weight="700">${kcal}</text>
    <text x="60" y="74" text-anchor="middle" font-size="11" fill="#7d8a81">/ ${budget} kcal</text>
  </svg>`;
}

export async function renderToday(view) {
  const date = todayStr();
  const profile = await store.getProfile();
  const meals = await store.mealsOn(date);
  const runs = await store.runsAll();
  const weights = await store.weightsAll();
  const tt = await store.timetable();
  const intake = sumKcal(meals.filter((m) => !m.photoPending));
  const weight = weights.length ? weights[weights.length - 1] : null;
  const week = planWeek(mondayOf(date), profile, tt, runs.map((r) => r.date));
  const today = week.days.find((d) => d.date === date);
  const expW = expectedWeight(date, profile);

  view.innerHTML = `
  <div class="card"><h2>今日热量</h2>
    <div class="ring-wrap">${ring(intake, profile.dailyBudgetKcal)}
      <div style="flex:1">
        ${meals.map((m) => `<div class="list-item"><span>${m.name}</span><span>${m.photoPending ? "待估算" : m.kcal + "kcal"}</span></div>`).join("")}
        <div class="muted" style="margin-top:8px">${meals.length ? "" : "还没记录，去「三餐」页添加"}</div>
      </div>
    </div>
  </div>
  <div class="card"><h2>今日安排</h2>
    <div class="big-num">${today && today.run ? "🏃 今天要乐跑" : "🛋 今天休息"}</div>
    <div class="muted">${today && today.run ? `建议 ${today.time} 开始 · ${today.reason}` : (today ? today.reason : "")}</div>
    <div class="muted">本周计划 ${week.runsScheduled} 次 · 学期第 ${week.weekIndex}/${week.totalWeeks} 周</div>
  </div>
  <div class="card"><h2>体重</h2>
    <div class="row">
      <input id="w-kg" type="number" step="0.1" placeholder="现在体重 kg">
      <button class="btn" id="w-save">记录</button>
    </div>
    <div class="muted" style="margin-top:8px">
      ${weight ? `最新 ${weight.kg}kg · 目标线今日 ${expW.toFixed(1)}kg` : "还没有记录"}
    </div>
  </div>
  <div class="card"><h2>发给教练</h2>
    <div class="muted">每晚把下面摘要发给 Kimi，获得点评和明日安排：</div>
    <pre class="muted" style="white-space:pre-wrap;margin-top:8px" id="digest"></pre>
    <button class="btn ghost" id="copy-digest">复制摘要</button>
  </div>`;

  document.getElementById("w-save").onclick = async () => {
    const kg = Number(document.getElementById("w-kg").value);
    if (kg > 30 && kg < 300) { await store.addWeight({ date, kg }); renderToday(view); }
  };
  const digest = buildDigest({ date, profile, meals, run: runs.find((r) => r.date === date), weight });
  document.getElementById("digest").textContent = digest;
  document.getElementById("copy-digest").onclick = () =>
    navigator.clipboard.writeText(digest).then(() => (document.getElementById("copy-digest").textContent = "已复制"));
}
