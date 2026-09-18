import * as db from "./db.js";

const DEFAULT_PROFILE = {
  heightCm: 170, startWeightKg: 79, targetWeightKg: 70,
  startDate: "2026-09-21", endDate: "2027-01-17",
  runsTotal: 40, runKm: 3, dailyBudgetKcal: 1800, reminderTime: "07:30",
};

export async function getProfile() {
  const p = await db.get("settings", "profile");
  return p ? p.value : { ...DEFAULT_PROFILE };
}
export async function saveProfile(value) { return db.put("settings", { key: "profile", value }); }

export async function addMeal(m) { return db.put("meals", { ...m, ts: Date.now() }); }
export async function mealsOn(date) {
  return (await db.all("meals")).filter((m) => m.date === date).sort((a, b) => a.ts - b.ts);
}
export async function deleteMeal(id) { return db.del("meals", id); }
export async function updateMeal(id, patch) {
  const m = (await db.all("meals")).find((x) => x.id === id);
  if (m) await db.put("meals", { ...m, ...patch });
}
export async function addRun(r) { return db.put("runs", { ...r, ts: Date.now() }); }
export async function runsAll() { return db.all("runs"); }
export async function addWeight(w) { return db.put("weights", { ...w, ts: Date.now() }); }
export async function weightsAll() {
  return (await db.all("weights")).sort((a, b) => (a.date < b.date ? -1 : 1));
}
export async function saveTimetable(list) {
  const old = await db.all("timetable");
  for (const e of old) await db.del("timetable", e.id);
  for (const e of list) await db.put("timetable", e);
}
export async function timetable() { return db.all("timetable"); }

export async function exportAll() {
  return JSON.stringify({
    profile: await getProfile(),
    meals: await db.all("meals"), runs: await db.all("runs"),
    weights: await db.all("weights"), timetable: await db.all("timetable"),
  }, null, 2);
}
export async function importAll(json) {
  const data = JSON.parse(json);
  if (data.profile) await saveProfile(data.profile);
  if (Array.isArray(data.timetable)) await saveTimetable(data.timetable);
  for (const m of data.meals || []) await db.put("meals", m);
  for (const r of data.runs || []) await db.put("runs", r);
  for (const w of data.weights || []) await db.put("weights", w);
}
