import { sumKcal } from "./food.js";

const TYPE_CN = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snack: "加餐" };

export function buildDigest({ date, profile, meals, run, weight }) {
  const lines = [`日期: ${date}`];
  if (weight) lines.push(`体重: ${weight.kg}kg`);
  for (const m of meals) {
    lines.push(`${TYPE_CN[m.type] || m.type}: ${m.name} ${m.photoPending ? "(待估算)" : m.kcal + "kcal"}`);
  }
  lines.push(`总摄入: ${sumKcal(meals.filter((m) => !m.photoPending))}/${profile.dailyBudgetKcal}kcal`);
  lines.push(`待估算餐数: ${meals.filter((m) => m.photoPending).length}`);
  lines.push(run ? `乐跑: 已完成 ${run.km}km` : "乐跑: 未完成");
  lines.push("乐跑总进度需在对话中由教练核对");
  return lines.join("\n");
}

export function parseCoachEstimates(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(/[|｜]/);
    if (parts.length < 2) continue;
    const name = parts[0].replace(/^\s*\d+[.、)）]\s*/, "").trim();
    const k = parts[1].match(/(\d+)\s*kcal/i);
    if (name && k) out.push({ name, kcal: Number(k[1]) });
  }
  return out;
}
