// No credentials or private data belong in this module or in the repository.
export class StateProtectionError extends Error {
  constructor(message) { super(message); this.name = 'StateProtectionError'; }
}
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
export function validateState(state, { importing = false } = {}) {
  if (!object(state) || !Array.isArray(state.areas) || !state.areas.length) throw new StateProtectionError('El respaldo debe contener tus áreas.');
  if (!['items', 'notes', 'entries'].some(key => Array.isArray(state[key])) || !Array.isArray(state.tasks) || !Array.isArray(state.goals) || !object(state.finance) || !object(state.savings)) {
    throw new StateProtectionError('Los datos están incompletos. Se detuvo la carga para proteger tu historial.');
  }
  for (const key of ['areas', 'items', 'tasks', 'goals', 'notes', 'entries']) {
    if (state[key] !== undefined && (!Array.isArray(state[key]) || state[key].some(row => !object(row)))) throw new StateProtectionError(`Formato inválido en ${key}.`);
  }
  for (const key of ['finance', 'savings', 'habits', 'ciclo']) {
    if (state[key] !== undefined && !object(state[key])) throw new StateProtectionError(`Formato inválido en ${key}.`);
  }
  for (const month of Object.values(state.finance || {})) {
    if (!object(month)) throw new StateProtectionError('Formato financiero inválido.');
    for (const key of ['ingresos', 'egresos', 'deudas']) if (month[key] !== undefined && (!Array.isArray(month[key]) || month[key].some(row => !object(row)))) throw new StateProtectionError('Movimientos financieros inválidos.');
  }
  for (const key of ['depositos', 'afp', 'apv']) if (state.savings?.[key] !== undefined && (!Array.isArray(state.savings[key]) || state.savings[key].some(row => !object(row)))) throw new StateProtectionError('Formato de ahorros inválido.');
  for (const value of Object.values(state.habits || {})) if (!Array.isArray(value)) throw new StateProtectionError('Formato de hábitos inválido.');
  for (const key of ['diasRegla', 'registros']) if (state.ciclo?.[key] !== undefined && !Array.isArray(state.ciclo[key])) throw new StateProtectionError('Formato de ciclo inválido.');
  if (state.ciclo?.registros?.some(row => !object(row))) throw new StateProtectionError('Hay registros de ciclo inválidos.');
  if (state.ciclo?.diasRegla?.some(day => typeof day !== 'string')) throw new StateProtectionError('Hay fechas de ciclo inválidas.');
  if (state.logros !== undefined && (!Number.isFinite(state.logros) || state.logros < 0)) throw new StateProtectionError('El total de logros no es válido.');
  if (importing && (!Array.isArray(state.items) || !object(state.habits) || !object(state.ciclo))) throw new StateProtectionError('Este archivo no es un respaldo completo de Bitácora.');
  return state;
}
export function hasRecords(state) {
  if (!state) return false;
  return ['items', 'tasks', 'goals', 'notes', 'entries'].some(key => state[key]?.length > 0)
    || Object.values(state.finance || {}).some(month => Object.values(month).some(rows => Array.isArray(rows) && rows.length))
    || Object.values(state.savings || {}).some(rows => Array.isArray(rows) && rows.length)
    || Object.values(state.habits || {}).some(rows => Array.isArray(rows) && rows.length)
    || Object.values(state.ciclo || {}).some(rows => Array.isArray(rows) && rows.length);
}
export const stateKey = (s) => JSON.stringify(['areas','items','tasks','finance','savings','goals','logros','habits','pal','plantStart','ciclo'].map(key => s[key]));
export class StateConflict extends Error {
  constructor() { super('Hay una versión más reciente en otro dispositivo. Descarga tus cambios antes de recargar.'); this.name = 'StateConflict'; }
}
export function createStateStore(client, backups, clock = () => new Date()) {
  let userId, version, loaded = false, previous;
  let backupWarning = false;
  const authenticatedUser = async () => {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    if (!data?.user) throw new StateProtectionError('Tu sesión terminó. Descarga tus cambios antes de volver a entrar.');
    if (userId && userId !== data.user.id) throw new StateProtectionError('La cuenta cambió. El guardado está detenido.');
    return data.user.id;
  };
  const keep = async (state) => {
    if (!state) return;
    try { await backups.record(userId, state); backupWarning = false; }
    catch { backupWarning = true; }
  };
  return {
    get userId() { return userId; },
    get backupWarning() { return backupWarning; },
    async load() {
      loaded = false;
      userId = await authenticatedUser();
      const { data, error } = await client.from('app_state').select('data, updated_at').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      if (data) {
        validateState(data.data);
        if (typeof data.updated_at !== 'string' || !Number.isFinite(Date.parse(data.updated_at))) throw new StateProtectionError('No se pudo verificar la versión guardada.');
        version = data.updated_at;
        previous = data.data;
        await keep(previous);
      } else { version = null; previous = null; }
      loaded = true;
      return previous;
    },
    async save(state) {
      if (!loaded) throw new StateProtectionError('No se permite guardar antes de cargar tus datos.');
      validateState(state);
      if (hasRecords(previous) && !hasRecords(state)) throw new StateProtectionError('Se bloqueó un guardado que dejaría todos tus registros vacíos. Descarga una copia antes de continuar.');
      await authenticatedUser();
      // Preserve the last confirmed data before any attempt to replace it.
      await keep(previous);
      const nextVersion = new Date(Math.max(clock().getTime(), version ? Date.parse(version) + 1 : 0)).toISOString();
      const row = { user_id: userId, data: state, updated_at: nextVersion };
      let query;
      if (version === null) query = client.from('app_state').insert(row);
      else query = client.from('app_state').update(row).eq('user_id', userId).eq('updated_at', version);
      const { data, error } = await query.select('updated_at').maybeSingle();
      if (error) { if (error.code === '23505') throw new StateConflict(); throw error; }
      if (!data) throw new StateConflict();
      version = data.updated_at;
      previous = state;
      await keep(state);
    },
  };
}
// One writer per mounted session: a pending newer snapshot replaces older pending work.
export function createSaveController(store, { onStatus, onSaved, onFailure }, delay = 600) {
  let timer, pending, running = false, paused = false, closed = false;
  const run = async () => {
    if (closed || running || paused || !pending) return;
    running = true;
    while (pending && !paused && !closed) {
      const snapshot = pending; pending = null;
      onStatus('saving');
      try {
        await store.save(snapshot);
        if (!closed) onSaved(snapshot);
      } catch (error) {
        if (!pending) pending = snapshot;
        paused = true;
        if (!closed) onFailure(error, pending);
      }
    }
    running = false;
    if (!closed && !paused && !pending) onStatus('saved');
  };
  return {
    enqueue(snapshot) {
      if (closed) return;
      pending = snapshot;
      if (!paused) onStatus('pending');
      clearTimeout(timer);
      if (!paused) timer = setTimeout(run, delay);
    },
    retry() { if (closed) return; paused = false; clearTimeout(timer); void run(); },
    close() { closed = true; pending = null; clearTimeout(timer); },
  };
}
