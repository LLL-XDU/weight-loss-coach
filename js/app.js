import { initNotify } from "./notify.js";
import { renderToday } from "./ui/today.js";
import { renderMeals } from "./ui/meals.js";
import { renderRuns } from "./ui/runs.js";
import { renderWeight } from "./ui/weight.js";
import { renderTimetable } from "./ui/timetable.js";
import { renderSettings } from "./ui/settings.js";

const routes = {
  today: renderToday, meals: renderMeals, runs: renderRuns,
  weight: renderWeight, timetable: renderTimetable, settings: renderSettings,
};

export function boot() {
  const view = document.getElementById("view");
  async function go(tab) {
    if (routes[tab]) return routes[tab](view);
    view.innerHTML = `<div class="card"><h2>模块开发中</h2></div>`;
  }
  document.querySelectorAll("#tabbar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tabbar button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      go(btn.dataset.tab);
    });
  });
  go("today");
}
boot();
initNotify();
