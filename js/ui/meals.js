import * as store from "../store.js";
import { searchFoods } from "../food.js";
import { parseCoachEstimates } from "../coach.js";
import { todayStr } from "../plan.js";

const TYPE_CN = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snack: "加餐" };

export async function renderMeals(view) {
  const date = todayStr();
  async function draw() {
    const meals = await store.mealsOn(date);
    view.innerHTML = `
    <div class="card"><h2>添加食物（${date}）</h2>
      <div class="row">
        <select id="m-type">
          <option value="breakfast">早餐</option><option value="lunch" selected>午餐</option>
          <option value="dinner">晚餐</option><option value="snack">加餐</option>
        </select>
      </div>
      <div class="row"><input id="m-q" placeholder="搜索食物，如：米饭、鸡腿"></div>
      <div class="search-results" id="m-results"></div>
      <div class="row" style="margin-top:12px">
        <input id="m-custom" placeholder="自定义名称 + 热量kcal，如：麻辣烫 600">
        <button class="btn ghost" id="m-add-custom">添加</button>
      </div>
      <div class="row">
        <input id="m-photo" placeholder="拍照餐食描述（待估算），如：午饭拍了照：两荤一素">
        <button class="btn ghost" id="m-add-photo">记录</button>
      </div>
    </div>
    <div class="card"><h2>今日已记录</h2>
      ${meals.map((m) => `<div class="list-item">
        <span>${TYPE_CN[m.type]} · ${m.name}${m.photoPending ? '<span class="tag">待估算</span>' : ""}</span>
        <span>${m.photoPending ? "" : m.kcal + "kcal "}<a href="#" data-del="${m.id}" style="color:#d64545">删</a></span>
      </div>`).join("") || '<div class="muted">空</div>'}
    </div>
    <div class="card"><h2>导入教练估算</h2>
      <div class="muted">把 Kimi 回复的估算（每行「名称 | 320kcal」）粘贴到这里，自动填热量：</div>
      <div class="row"><input id="coach-in" placeholder="红烧肉 | 450kcal"></div>
      <button class="btn" id="coach-apply" style="margin-top:8px">匹配到待估算餐</button>
    </div>`;

    const q = document.getElementById("m-q");
    q.oninput = () => {
      const rs = searchFoods(q.value);
      document.getElementById("m-results").innerHTML = rs.map((f, i) =>
        `<div class="search-item" data-i="${i}"><span>${f.name}<span class="tag">${f.tag}</span></span><span>${f.kcal}kcal</span></div>`).join("");
      document.querySelectorAll("#m-results .search-item").forEach((el) => {
        el.onclick = async () => {
          const f = rs[Number(el.dataset.i)];
          await store.addMeal({ date, type: document.getElementById("m-type").value, name: f.name, kcal: f.kcal, photoPending: false });
          draw();
        };
      });
    };
    document.getElementById("m-add-custom").onclick = async () => {
      const m = document.getElementById("m-custom").value.match(/^(.*?)\s+(\d+)$/);
      if (m) {
        await store.addMeal({ date, type: document.getElementById("m-type").value, name: m[1], kcal: Number(m[2]), photoPending: false });
        draw();
      }
    };
    document.getElementById("m-add-photo").onclick = async () => {
      const name = document.getElementById("m-photo").value.trim();
      if (name) {
        await store.addMeal({ date, type: document.getElementById("m-type").value, name, kcal: 0, photoPending: true });
        draw();
      }
    };
    document.getElementById("coach-apply").onclick = async () => {
      const est = parseCoachEstimates(document.getElementById("coach-in").value);
      const pending = (await store.mealsOn(date)).filter((m) => m.photoPending);
      for (let i = 0; i < Math.min(est.length, pending.length); i++) {
        await store.updateMeal(pending[i].id, { name: est[i].name, kcal: est[i].kcal, photoPending: false });
      }
      draw();
    };
    view.querySelectorAll("[data-del]").forEach((a) => {
      a.onclick = async (e) => { e.preventDefault(); await store.deleteMeal(Number(a.dataset.del)); draw(); };
    });
  }
  await draw();
}
