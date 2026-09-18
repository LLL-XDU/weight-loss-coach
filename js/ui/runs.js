import * as store from "../store.js";
import { planWeek, mondayOf, todayStr } from "../plan.js";

const EXERCISES = [
  ["squat", "深蹲 ×15"], ["lunge", "箭步蹲 ×12/腿"], ["calf", "提踵 ×20"],
  ["plank", "平板支撑 45秒"], ["pushup", "俯卧撑 ×12"],
];

export async function renderRuns(view) {
  const date = todayStr();
  const profile = await store.getProfile();
  const runs = await store.runsAll();
  const tt = await store.timetable();
  const doneDates = runs.map((r) => r.date);
  const week = planWeek(mondayOf(date), profile, tt, doneDates);
  const todayRun = runs.find((r) => r.date === date);
  const DOW = ["一", "二", "三", "四", "五", "六", "日"];

  view.innerHTML = `
  <div class="card"><h2>本周计划（第 ${week.weekIndex}/${week.totalWeeks} 周，安排 ${week.runsScheduled} 次）</h2>
    <div class="week-grid">
      ${week.days.map((d, i) => {
        const done = doneDates.includes(d.date);
        return `<div class="day-cell ${done ? "done" : d.run ? "run" : ""}">
          <div class="d">周${DOW[i]}</div>
          <div>${done ? "✓ 已跑" : d.run ? d.time : ""}</div>
        </div>`;
      }).join("")}
    </div>
  </div>
  <div class="card"><h2>今日打卡</h2>
    ${todayRun ? `<div class="big-num">已完成 ${todayRun.km}km ✓</div>
      <div class="ex-list">${EXERCISES.map(([k, label]) =>
        `<label><input type="checkbox" data-ex="${k}" ${todayRun.exercises[k] ? "checked" : ""}> ${label}</label>`).join("")}
      </div>`
    : `<div class="muted" id="run-hint">${week.days.find((d) => d.date === date)?.run ? "今天该跑，跑完点下面打卡" : "今天没有跑步计划"}</div>
      <button class="btn" id="run-checkin" ${week.days.find((d) => d.date === date)?.run ? "" : "disabled"} style="margin-top:8px">完成 ${profile.runKm}km 乐跑打卡</button>`}
  </div>
  <div class="card"><h2>累计进度</h2>
    <div class="big-num">${doneDates.length} / ${profile.runsTotal} 次</div>
    <div class="muted">完成 ${Math.round(doneDates.length / profile.runsTotal * 100)}%</div>
  </div>`;

  const btn = document.getElementById("run-checkin");
  if (btn) btn.onclick = async () => {
    await store.addRun({ date, km: profile.runKm,
      exercises: { squat: false, lunge: false, calf: false, plank: false, pushup: false } });
    renderRuns(view);
  };
  view.querySelectorAll("[data-ex]").forEach((cb) => {
    cb.onchange = async () => {
      todayRun.exercises[cb.dataset.ex] = cb.checked;
      await store.addRun({ ...todayRun });
    };
  });
}
