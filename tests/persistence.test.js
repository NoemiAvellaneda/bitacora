import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStateStore, createSaveController, validateState, StateConflict } from '../src/statePersistence.js';
import { backupPlan, exportIsDue } from '../src/localBackups.js';
const state = (label = 'original') => ({ areas: [{ id: 'personal' }], items: [{ id: label, coll: 'notas', title: label }], tasks: [], goals: [], finance: {}, savings: {}, habits: {}, ciclo: { diasRegla: [] } });
const copy = value => structuredClone(value);
function fixture(initial = state()) {
  const db = { row: initial ? { user_id: 'u1', data: initial, updated_at: '2026-10-28T10:00:00.000Z' } : null, writes: 0, error: null, readError: null, user: 'u1', authError: null };
  const client = {
    auth: { getUser: async () => ({ data: { user: db.user ? { id: db.user } : null }, error: db.authError }) },
    from() {
      let op = 'select', value, filters = {};
      const query = {
        select() { return query; }, eq(key, val) { filters[key] = val; return query; },
        insert(row) { op = 'insert'; value = row; return query; },
        update(row) { op = 'update'; value = row; return query; },
        async maybeSingle() {
          if (op === 'select') return { data: db.readError ? null : copy(db.row), error: db.readError };
          if (db.error) return { data: null, error: db.error };
          if (op === 'insert' && db.row) return { data: null, error: { code: '23505' } };
          if (op === 'update' && (!db.row || Object.entries(filters).some(([key,val]) => db.row[key] !== val))) return { data: null, error: null };
          db.row = copy(value); db.writes++;
          return { data: { updated_at: db.row.updated_at }, error: null };
        },
      };
      return query;
    },
  };
  const snapshots = [];
  const backups = { record: async (user, data) => snapshots.push({user, data: copy(data)}) };
  return { db, backups, snapshots, store: () => createStateStore(client, backups, () => new Date('2026-10-28T10:00:00.000Z')) };
}
test('reading existing data creates a local copy and never writes to Supabase', async () => {
  const f = fixture(); const store = f.store();
  assert.deepEqual(await store.load(), state()); assert.equal(f.db.writes, 0); assert.equal(f.snapshots.length, 1);
});
test('failed reads, missing sessions and malformed remote state cannot save defaults', async () => {
  for (const setup of [f => {f.db.readError = Error('network');}, f => {f.db.user = null;}, f => {f.db.authError = Error('expired');}, f => {f.db.row.data = {};}]) {
    const f = fixture(); setup(f); const store = f.store();
    await assert.rejects(store.load()); await assert.rejects(store.save(state('bad'))); assert.equal(f.db.writes, 0);
  }
});
test('successful read without a row permits explicit first save, never upsert', async () => {
  const f = fixture(null); const store = f.store(); assert.equal(await store.load(), null); assert.equal(f.db.writes, 0);
  await store.save(state()); assert.equal(f.db.writes, 1);
});
test('stale second device cannot overwrite the first device', async () => {
  const f = fixture(); const first = f.store(), second = f.store();
  await first.load(); await second.load(); await first.save(state('first'));
  await assert.rejects(second.save(state('second')), StateConflict);
  assert.equal(f.db.row.data.items[0].id, 'first'); assert.equal(f.db.writes, 1);
});
test('two new sessions cannot overwrite one another through an insert race', async () => {
  const f = fixture(null); const first = f.store(), second = f.store();
  await first.load(); await second.load(); await first.save(state('first'));
  await assert.rejects(second.save(state('second')), StateConflict); assert.equal(f.db.writes, 1);
});
test('account changes, invalid imports and an accidental complete wipe are rejected', async () => {
  const f = fixture(); const store = f.store(); await store.load();
  const empty = { ...state(), items: [] };
  await assert.rejects(store.save(empty), /vacíos/);
  assert.throws(() => validateState({areas: []}, {importing: true}));
  assert.throws(() => validateState({areas: [{id: 'personal'}]}));
  const partial = state(); delete partial.savings;
  assert.throws(() => validateState(partial, {importing: true}));
  assert.throws(() => validateState({...state(), finance: { '2026-10': {ingresos: 'broken'} }}, {importing: true}));
  assert.throws(() => validateState({...state(), ciclo: {diasRegla: 'broken'}}, {importing: true}));
  assert.throws(() => validateState({...state(), finance: {'2026-10': {ingresos: [null]}}}, {importing: true}));
  assert.throws(() => validateState({...state(), savings: {afp: [null]}}, {importing: true}));
  f.db.user = 'u2'; await assert.rejects(store.save(state('wrong account'))); assert.equal(f.db.writes, 0);
});
test('quota failure is visible but does not prevent server persistence', async () => {
  const f = fixture(); f.backups.record = async () => { throw Error('quota'); }; const store = f.store();
  await store.load(); assert.equal(store.backupWarning, true);
  await store.save(state('changed')); assert.equal(f.db.writes, 1); assert.equal(store.backupWarning, true);
});
test('network failure leaves remote data intact and can be retried', async () => {
  const f = fixture(); const store = f.store(); await store.load(); f.db.error = Error('offline');
  await assert.rejects(store.save(state('changed'))); assert.equal(f.db.writes, 0);
  f.db.error = null; await store.save(state('changed')); assert.equal(f.db.row.data.items[0].id, 'changed');
});
test('backup rotation retains fourteen usage days without overwriting the daily original or another user', () => {
  let rows = [{id: 'other:daily:old',userId:'other',kind:'daily',savedAt:'2026-01-01T00:00:00Z'}];
  for (let day=1; day<=20; day++) {
    const date = new Date(2026,9,day,12);
    const plan = backupPlan(rows, 'u1', state(String(day)), date);
    rows = rows.filter(row => !plan.deletes.includes(row.id) && !plan.puts.some(put => put.id === row.id)).concat(plan.puts);
  }
  assert.equal(rows.filter(row => row.userId === 'u1' && row.kind === 'daily').length,14);
  assert.equal(rows.filter(row => row.userId === 'other').length,1);
  const plan = backupPlan(rows,'u1',state('edited'),new Date(2026,9,20,13));
  assert.deepEqual(plan.puts.map(row => row.kind),['latest']);
  assert.equal(rows.find(row => row.id.endsWith('daily:2026-10-20')).data.items[0].id,'20');
});
test('weekly reminder handles missing, invalid, recent and old exports', () => {
  const now = Date.parse('2026-10-28T12:00:00Z');
  assert.equal(exportIsDue(null,now),true); assert.equal(exportIsDue('bad',now),true);
  assert.equal(exportIsDue('2099-01-01T00:00:00Z',now),true);
  assert.equal(exportIsDue('2026-10-27T12:00:00Z',now),false);
  assert.equal(exportIsDue('2026-10-21T12:00:00Z',now),true);
});
const tick = () => new Promise(resolve => setTimeout(resolve, 8));
test('save controller serializes requests and coalesces pending snapshots', async () => {
  let release; const saved=[]; let active=0, max=0;
  const store={async save(s) { active++; max=Math.max(max,active); if(s==='first') await new Promise(r=>{release=r;}); saved.push(s); active--; }};
  const controller=createSaveController(store,{onStatus(){},onSaved(){},onFailure(){assert.fail('unexpected');}},0);
  controller.enqueue('first'); await tick(); controller.enqueue('intermediate'); controller.enqueue('last');
  release(); await tick(); assert.deepEqual(saved,['first','last']); assert.equal(max,1); controller.close();
});
test('controller pauses on failure and retries latest pending snapshot only on request', async () => {
  const saved=[];let fail=true;let errors=0;
  const controller=createSaveController({async save(s){if(fail)throw Error('offline');saved.push(s);}}, {onStatus(){},onSaved(){},onFailure(){errors++;}},0);
  controller.enqueue('first');await tick();controller.enqueue('latest');await tick();assert.equal(errors,1);assert.deepEqual(saved,[]);
  fail=false;controller.retry();await tick();assert.deepEqual(saved,['latest']);controller.close();
});
test('unmounted controller cannot start pending writes', async () => {
  let writes=0;
  const controller=createSaveController({async save(){writes++;}},{onStatus(){},onSaved(){},onFailure(){}},0);
  controller.enqueue(state());controller.close();await tick();assert.equal(writes,0);
});
