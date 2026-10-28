import { test } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { createLocalBackups } from '../src/localBackups.js';
test('IndexedDB commits daily and latest copies, separates drafts and isolates accounts', async () => {
  const idb = new IDBFactory(), store = createLocalBackups(idb);
  await store.record('a',{items:['original']});
  await store.record('a',{items:['new']});
  await store.draft('a',{items:['unsaved']});
  await store.record('b',{items:['private']});
  const rows=await store.list('a');
  assert.equal(rows.length,3);
  assert.deepEqual(rows.find(r=>r.kind==='daily').data,{items:['original']});
  assert.deepEqual(rows.find(r=>r.kind==='latest').data,{items:['new']});
  assert.deepEqual(rows.find(r=>r.kind==='draft').data,{items:['unsaved']});
  assert.equal((await store.list('b')).length,2);
  assert.equal((await createLocalBackups(idb).list('a')).length,3,'survives a new store instance');
});
test('unavailable IndexedDB reports errors instead of pretending backups exist',async()=>{
 const store=createLocalBackups(null);
 await assert.rejects(store.record('a',{}));await assert.rejects(store.list('a'));
});

test('confirming a draft removes only the matching draft, never a newer pending edit',async()=>{
 const store=createLocalBackups(new IDBFactory());
 await store.draft('a',{items:['newer']});await store.record('a',{items:['older']});
 assert.equal((await store.list('a')).some(row=>row.kind==='draft'),true);
 await store.record('a',{items:['newer']});
 assert.equal((await store.list('a')).some(row=>row.kind==='draft'),false);
});
test('a new session archives pending changes before replacing its draft, retaining at most three prior drafts',async()=>{
 const idb=new IDBFactory();
 let store=createLocalBackups(idb);
 await store.record('a',{items:['remote']});
 await store.draft('a',{items:['unsaved original']});
 store=createLocalBackups(idb);
 await store.record('a',{items:['remote']});
 await store.draft('a',{items:['new session']});
 let rows=await store.list('a');
 assert.deepEqual(rows.find(row=>row.kind==='recovery').data,{items:['unsaved original']});
 assert.deepEqual(rows.find(row=>row.kind==='draft').data,{items:['new session']});
 for(let i=0;i<5;i++){store=createLocalBackups(idb);await store.draft('a',{items:[`new ${i}`]});}
 rows=await store.list('a');
 assert.equal(rows.filter(row=>row.kind==='recovery').length,3);
 assert.equal(rows.filter(row=>row.kind==='daily').length,1);
});
