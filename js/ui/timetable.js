import * as store from "../store.js";

const DOW = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export async function renderTimetable(view) {
  const tt = await store.timetable();
  view.innerHTML = `
  <div class="card"><h2>课表</h2>
    ${DOW.map((d, i) => {
      const list = tt.filter((c) => c.dayOfWeek === i + 1).sort((a, b) => (a.start < b.start ? -1 : 1));
      return `<div style="margin-bottom:10px"><b>${d}</b>
        ${list.map((c) => `<div class="list-item"><span>${c.name}</span><span>${c.start}-${c.end}</span></div>`).join("") || '<div class="muted">无课</div>'}
      </div>`;
    }).join("")}
  </div>
  <div class="card"><h2>导入课表 JSON</h2>
    <div class="muted">把 Kimi 从课表截图识别出的 JSON 粘贴到这里（格式：[{"name":"高数","dayOfWeek":2,"start":"14:00","end":"15:40"}]）</div>
    <div class="row"><input id="tt-in" placeholder='[{"name":"高数","dayOfWeek":2,...}]'></div>
    <button class="btn" id="tt-apply" style="margin-top:8px">导入</button>
    <div class="muted" id="tt-msg"></div>
  </div>`;
  document.getElementById("tt-apply").onclick = async () => {
    try {
      const list = JSON.parse(document.getElementById("tt-in").value);
      await store.saveTimetable(list);
      renderTimetable(view);
    } catch (e) {
      document.getElementById("tt-msg").textContent = "JSON 格式错误：" + e.message;
    }
  };
}
