import * as store from "./store.js";
import { planWeek, mondayOf, todayStr } from "./plan.js";

export async function initNotify() {
  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("sw.js"); } catch (e) { console.warn(e); }
  }
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
  setInterval(check, 60000);
  check();
}

async function check() {
  const now = new Date();
  const hm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const date = todayStr();
  const profile = await store.getProfile();
  if (hm !== profile.reminderTime) return;
  if (localStorage.getItem("lastNotifyDate") === date) return;
  localStorage.setItem("lastNotifyDate", date);
  const tt = await store.timetable();
  const done = (await store.runsAll()).map((r) => r.date);
  const week = planWeek(mondayOf(date), profile, tt, done);
  const today = week.days.find((d) => d.date === date);
  const body = today && today.run
    ? `今天要乐跑 ${profile.runKm}km，建议 ${today.time}（${today.reason}）`
    : "今天休息，注意三餐记录";
  if (Notification.permission === "granted") {
    new Notification("减脂督导 · 今日跑步安排", { body });
  }
}
