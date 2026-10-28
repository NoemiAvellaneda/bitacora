const DB_NAME = 'bitacora-backups-v1';
const STORE = 'snapshots';
const DAY = 86400000;
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function backupPlan(rows, userId, state, date = new Date()) {
  const own = rows.filter(row => row.userId === userId);
  const stamp = date.toISOString();
  const dayId = `${userId}:daily:${localDay(date)}`;
  const puts = [{ id: `${userId}:latest`, userId, kind: 'latest', savedAt: stamp, data: state }];
  if (!own.some(row => row.id === dayId)) puts.push({ id: dayId, userId, kind: 'daily', savedAt: stamp, data: state });
  const dailies = [...own.filter(row => row.kind === 'daily'), ...puts.filter(row => row.kind === 'daily')].sort((a,b) => b.savedAt.localeCompare(a.savedAt));
  const deletes = dailies.slice(14).map(row => row.id);
  const draft = own.find(row => row.kind === 'draft');
  if (draft && JSON.stringify(draft.data) === JSON.stringify(state)) deletes.push(draft.id);
  return { puts, deletes };
}
export function exportIsDue(exportedAt, now = Date.now()) {
  return !Number.isFinite(Date.parse(exportedAt)) || Date.parse(exportedAt) > now + DAY || now - Date.parse(exportedAt) >= 7 * DAY;
}
export function createLocalBackups(idb = globalThis.indexedDB) {
  let connection;
  const sessionId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  const open = () => connection || (connection = new Promise((resolve, reject) => {
    if (!idb) { reject(new Error('Este navegador no permite copias locales.')); return; }
    const request = idb.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('userId', 'userId');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('No se pudo abrir el almacenamiento local.'));
  }));
  const transaction = async (mode, action) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      let value;
      tx.oncomplete = () => resolve(value);
      tx.onabort = tx.onerror = () => reject(tx.error || new Error('No se pudo guardar la copia local.'));
      action(tx.objectStore(STORE), result => { value = result; });
    });
  };
  return {
    async record(userId, state) {
      return transaction('readwrite', store => {
        const request = store.index('userId').getAll(userId);
        request.onsuccess = () => {
          const plan = backupPlan(request.result, userId, state);
          plan.puts.forEach(row => store.put(row));
          plan.deletes.forEach(id => store.delete(id));
        };
      });
    },
    async draft(userId, state) {
      if (!userId) return;
      return transaction('readwrite', store => {
        const request = store.index('userId').getAll(userId);
        request.onsuccess = () => {
          const own = request.result;
          const old = own.find(row => row.kind === 'draft');
          if (old && old.sessionId !== sessionId && JSON.stringify(old.data) !== JSON.stringify(state)) {
            // A new session must not erase the only pending changes from a prior session.
            const recovered = { ...old, id: `${userId}:recovery:${sessionId}`, kind: 'recovery' };
            store.put(recovered);
            const history = [...own.filter(row => row.kind === 'recovery'), recovered].sort((a,b) => b.savedAt.localeCompare(a.savedAt));
            history.slice(3).forEach(row => store.delete(row.id));
          }
          store.put({ id: `${userId}:draft`, userId, kind: 'draft', sessionId, savedAt: new Date().toISOString(), data: state });
        };
      });
    },
    async list(userId) {
      if (!userId) return [];
      const rows = await transaction('readonly', (store, done) => {
        const request = store.index('userId').getAll(userId);
        request.onsuccess = () => done(request.result);
      });
      return rows.filter(row => row.userId === userId).sort((a,b) => b.savedAt.localeCompare(a.savedAt));
    },
  };
}
