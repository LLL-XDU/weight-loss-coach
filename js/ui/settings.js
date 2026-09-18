import * as store from "../store.js";

export async function renderSettings(view) {
  const p = await store.getProfile();
  view.innerHTML = `
  <div class="card"><h2>目标与预算</h2>
    <div class="row"><span style="width:110px">目标体重 kg</span><input id="s-target" type="number" step="0.5" value="${p.targetWeightKg}"></div>
    <div class="row"><span style="width:110px">每日热量 kcal</span><input id="s-budget" type="number" step="10" value="${p.dailyBudgetKcal}"></div>
    <div class="row"><span style="width:110px">乐跑总数</span><input id="s-runs" type="number" value="${p.runsTotal}"></div>
    <button class="btn" id="s-save" style="margin-top:8px">保存</button>
  </div>
  <div class="card"><h2>数据</h2>
    <button class="btn ghost" id="s-export">导出全部数据</button>
    <div class="row" style="margin-top:8px"><input id="s-import" placeholder="粘贴导出的 JSON"></div>
    <button class="btn ghost" id="s-import-btn" style="margin-top:8px">导入</button>
    <div class="muted" style="margin-top:8px">数据只存在本机，换手机时先导出再导入。</div>
  </div>`;
  document.getElementById("s-save").onclick = async () => {
    await store.saveProfile({ ...p,
      targetWeightKg: Number(document.getElementById("s-target").value),
      dailyBudgetKcal: Number(document.getElementById("s-budget").value),
      runsTotal: Number(document.getElementById("s-runs").value) });
    document.getElementById("s-save").textContent = "已保存";
  };
  document.getElementById("s-export").onclick = async () => {
    const json = await store.exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "wl-data.json";
    a.click();
  };
  document.getElementById("s-import-btn").onclick = async () => {
    await store.importAll(document.getElementById("s-import").value);
    document.getElementById("s-import-btn").textContent = "已导入";
  };
}
