const DB_NAME = "wl-coach", DB_VER = 1;
let _db = null;

export function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "key" });
      if (!db.objectStoreNames.contains("meals")) db.createObjectStore("meals", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("runs")) db.createObjectStore("runs", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("weights")) db.createObjectStore("weights", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("timetable")) db.createObjectStore("timetable", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

function reqP(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function put(store, value) {
  return reqP((await openDB()).transaction(store, "readwrite").objectStore(store).put(value));
}
export async function del(store, key) {
  return reqP((await openDB()).transaction(store, "readwrite").objectStore(store).delete(key));
}
export async function all(store) {
  return reqP((await openDB()).transaction(store, "readonly").objectStore(store).getAll());
}
export async function get(store, key) {
  return reqP((await openDB()).transaction(store, "readonly").objectStore(store).get(key));
}
