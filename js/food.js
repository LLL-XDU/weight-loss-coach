export const FOODS = [
  { name: "米饭(一两)", kcal: 116, tag: "主食" }, { name: "米饭(二两)", kcal: 232, tag: "主食" },
  { name: "米饭(三两)", kcal: 348, tag: "主食" }, { name: "馒头(一个)", kcal: 221, tag: "主食" },
  { name: "面条(一碗)", kcal: 380, tag: "主食" }, { name: "包子(一个)", kcal: 180, tag: "主食" },
  { name: "粥(一碗)", kcal: 90, tag: "主食" }, { name: "煎饼果子(一套)", kcal: 450, tag: "主食" },
  { name: "鸡胸肉(一份150g)", kcal: 180, tag: "荤菜" }, { name: "红烧鸡腿(一个)", kcal: 260, tag: "荤菜" },
  { name: "红烧肉(一份)", kcal: 450, tag: "荤菜" }, { name: "糖醋里脊(一份)", kcal: 400, tag: "荤菜" },
  { name: "清蒸鱼(一份)", kcal: 220, tag: "荤菜" }, { name: "水煮牛肉(一份)", kcal: 380, tag: "荤菜" },
  { name: "宫保鸡丁(一份)", kcal: 350, tag: "荤菜" }, { name: "鱼香肉丝(一份)", kcal: 330, tag: "荤菜" },
  { name: "炒青菜(一份)", kcal: 90, tag: "素菜" }, { name: "番茄炒蛋(一份)", kcal: 200, tag: "素菜" },
  { name: "土豆丝(一份)", kcal: 180, tag: "素菜" }, { name: "麻婆豆腐(一份)", kcal: 220, tag: "素菜" },
  { name: "地三鲜(一份)", kcal: 300, tag: "素菜" }, { name: "凉拌黄瓜(一份)", kcal: 60, tag: "素菜" },
  { name: "鸡蛋(一个)", kcal: 78, tag: "蛋奶" }, { name: "牛奶(一盒250ml)", kcal: 165, tag: "蛋奶" },
  { name: "酸奶(一杯)", kcal: 120, tag: "蛋奶" }, { name: "豆浆(一杯)", kcal: 80, tag: "蛋奶" },
  { name: "苹果(一个)", kcal: 95, tag: "水果" }, { name: "香蕉(一根)", kcal: 105, tag: "水果" },
  { name: "橙子(一个)", kcal: 62, tag: "水果" }, { name: "西瓜(一块)", kcal: 50, tag: "水果" },
  { name: "可乐(一罐330ml)", kcal: 140, tag: "饮料" }, { name: "奶茶(一杯)", kcal: 400, tag: "饮料" },
  { name: "橙汁(一瓶)", kcal: 160, tag: "饮料" }, { name: "咖啡(美式一杯)", kcal: 10, tag: "饮料" },
  { name: "炸鸡排(一份)", kcal: 550, tag: "高脂" }, { name: "薯条(一份)", kcal: 380, tag: "高脂" },
  { name: "汉堡(一个)", kcal: 550, tag: "高脂" }, { name: "披萨(一角)", kcal: 285, tag: "高脂" },
  { name: "泡面(一桶)", kcal: 450, tag: "主食" }, { name: "饺子(10个)", kcal: 500, tag: "主食" },
  { name: "玉米(一根)", kcal: 110, tag: "主食" }, { name: "红薯(一个)", kcal: 130, tag: "主食" },
  { name: "全麦面包(两片)", kcal: 160, tag: "主食" }, { name: "燕麦(一碗)", kcal: 150, tag: "主食" },
  { name: "坚果(一把)", kcal: 170, tag: "零食" }, { name: "薯片(一包)", kcal: 320, tag: "零食" },
  { name: "巧克力(一块)", kcal: 90, tag: "零食" }, { name: "冰淇淋(一个)", kcal: 200, tag: "零食" },
  { name: "沙县鸡腿饭(一份)", kcal: 700, tag: "套餐" }, { name: "黄焖鸡米饭(一份)", kcal: 750, tag: "套餐" },
  { name: "兰州拉面(一碗)", kcal: 550, tag: "套餐" }, { name: "麻辣烫(一份)", kcal: 600, tag: "套餐" },
];

export function searchFoods(query, limit = 10) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return FOODS.filter((f) => f.name.toLowerCase().includes(q)).slice(0, limit);
}
export function sumKcal(items) {
  return items.reduce((s, it) => s + (it.kcal || 0), 0);
}
