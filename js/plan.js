export function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function fmtDate(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function addDays(str, n) {
  const d = parseDate(str);
  d.setDate(d.getDate() + n);
  return fmtDate(d);
}
export function todayStr() { return fmtDate(new Date()); }
export function mondayOf(str) {
  const dow = (parseDate(str).getDay() + 6) % 7;
  return addDays(str, -dow);
}
export function weeksBetween(startStr, endStr) {
  return Math.max(1, Math.ceil((parseDate(endStr) - parseDate(startStr)) / (7 * 86400000)));
}
export function dayOfWeek(str) { return ((parseDate(str).getDay() + 6) % 7) + 1; }

export function expectedWeight(dateStr, profile) {
  const t = parseDate(dateStr), s = parseDate(profile.startDate), e = parseDate(profile.endDate);
  if (t <= s) return profile.startWeightKg;
  if (t >= e) return profile.targetWeightKg;
  const ratio = (t - s) / (e - s);
  return profile.startWeightKg + (profile.targetWeightKg - profile.startWeightKg) * ratio;
}

export function freeSlotsOn(dateStr, timetable) {
  const dow = dayOfWeek(dateStr);
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const toHM = (min) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  const classes = timetable.filter((c) => c.dayOfWeek === dow).sort((a, b) => toMin(a.end) - toMin(b.end));
  if (classes.length === 0) return { lastClassEnd: null, suggestedTime: "16:30", free: true };
  const lastEnd = toMin(classes[classes.length - 1].end);
  if (lastEnd > 17 * 60) return { lastClassEnd: toHM(lastEnd), suggestedTime: null, free: false };
  return { lastClassEnd: toHM(lastEnd), suggestedTime: toHM(Math.max(lastEnd + 60, 16 * 60 + 30)), free: true };
}

export function planWeek(mondayStr, profile, timetable, completedDates) {
  const totalWeeks = Math.max(1, Math.round((parseDate(profile.endDate) - parseDate(profile.startDate)) / (7 * 86400000)));
  const weekIndex = Math.min(totalWeeks, Math.max(1, Math.round((parseDate(mondayStr) - parseDate(profile.startDate)) / (7 * 86400000)) + 1));
  const remaining = profile.runsTotal - completedDates.length;
  const remainingWeeks = totalWeeks - weekIndex + 1;
  const runsScheduled = Math.max(0, Math.ceil(remaining / remainingWeeks));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(mondayStr, i);
    const slot = freeSlotsOn(date, timetable);
    days.push({ date, run: false, time: slot.suggestedTime, free: slot.free,
      reason: slot.free ? (slot.lastClassEnd ? `最后一节 ${slot.lastClassEnd} 下课` : "无课") + `，建议 ${slot.suggestedTime}` : "晚上有课，不建议" });
  }
  days.filter((d) => d.free && !completedDates.includes(d.date))
    .slice(0, runsScheduled)
    .forEach((d) => { d.run = true; });
  return { weekIndex, totalWeeks, runsScheduled, days };
}
