import {test, after} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
import {createRequire} from 'node:module';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir=await mkdtemp(join(tmpdir(),'bitacora-test-'));
after(()=>rm(dir,{recursive:true,force:true}));
const require=createRequire(import.meta.url);
const result=await build({entryPoints:['src/Bitacora.jsx'],bundle:true,platform:'node',format:'esm',write:false,banner:{js:'import { createRequire as createBundleRequire } from \"node:module\"; const require = createBundleRequire(import.meta.url);'},plugins:[{name:'test-client',setup(builder){
 builder.onResolve({filter:/^react$/},()=>({path:require.resolve('react'),external:true}));
 builder.onResolve({filter:/supabase\.js$/},()=>({path:'mock-client',namespace:'mock'}));
 builder.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:'export const supabase = globalThis.__testClient;',loader:'js'}));
}}]});
function environment({readError=false}={}){
 const db={writes:0,readError,error:null,row:{user_id:'a',updated_at:'2026-10-28T10:00:00.000Z',data:{areas:[{id:'personal',name:'Personal',kind:'vida',importance:4}],items:[{id:'book',coll:'libros',title:'Libro de prueba',meta:'',note:'',date:'2026-10-27T12:00:00Z',status:'Leyendo'}],tasks:[],finance:{},savings:{afp:[],apv:[],depositos:[]},goals:[],habits:{},ciclo:{diasRegla:[]},pal:'mint',logros:0,plantStart:'2026-07-01T12:00:00Z'}}};
 globalThis.window={addEventListener(){},removeEventListener(){},setInterval,clearInterval,location:{reload(){}},confirm(){return false;}};
 globalThis.localStorage={getItem(){return null;},setItem(){}};
 globalThis.indexedDB=new IDBFactory();
 globalThis.__testClient={auth:{getUser:async()=>({data:{user:{id:'a'}}}),getSession:async()=>({data:{session:{user:{id:'a'}}}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signOut:async()=>{}},from(){let op='select',value,filters={};const q={select(){return q;},eq(k,v){filters[k]=v;return q;},insert(v){op='insert';value=v;return q;},update(v){op='update';value=v;return q;},async maybeSingle(){if(op==='select')return {data:db.readError?null:structuredClone(db.row),error:db.readError?Error('network'):null};if(db.waitWrite)await db.waitWrite;if(db.error)return {data:null,error:db.error};if(op==='update'&&Object.entries(filters).some(([k,v])=>db.row[k]!==v))return {data:null,error:null};db.row=structuredClone(value);db.writes++;return {data:{updated_at:value.updated_at},error:null};}};return q;}};
 return db;
}
let moduleNumber=0;
async function mount(){const file=join(dir,`${moduleNumber++}.mjs`);await writeFile(file,result.outputFiles[0].text);const {default:Root}=await import(pathToFileURL(file));let renderer;await act(async()=>{renderer=TestRenderer.create(React.createElement(Root));await new Promise(r=>setTimeout(r,30));});return renderer;}
const flush=async(ms=700)=>act(async()=>{await new Promise(r=>setTimeout(r,ms));});
const message=renderer=>JSON.stringify(renderer.toJSON());
test('real React hooks never save on opening; persist edits and show failure, retry and conflict',async()=>{
 const db=environment();const renderer=await mount();await flush();
 assert.match(message(renderer),/Datos cargados/);assert.equal(db.writes,0);
 const taskInput=()=>renderer.root.findAllByType('input').find(input=>input.props['aria-label']?.startsWith('Nueva tarea para'));
 const add=async text=>{await act(async()=>taskInput().props.onChange({target:{value:text}}));await act(async()=>taskInput().props.onKeyDown({key:'Enter'}));await flush();};
 await add('Nueva tarea');assert.equal(db.writes,1);assert.equal(db.row.data.items[0].title,'Libro de prueba');assert.match(message(renderer),/Guardado ·/);
 db.error=Error('offline');await add('Pendiente');assert.equal(db.writes,1);assert.match(message(renderer),/Guardado detenido/);
 db.error=null;await act(async()=>renderer.root.findAllByType('button').find(b=>b.children.includes('Reintentar guardado')).props.onClick());await flush();
 assert.equal(db.writes,2);assert.equal(db.row.data.tasks.some(t=>t.text==='Pendiente'),true);
 db.row.updated_at='2099-01-01T00:00:00.000Z';await add('Conflicto');assert.equal(db.writes,2);assert.match(message(renderer),/versión más reciente/);
 await act(async()=>renderer.unmount());
});
test('real React load failure displays protection screen, no defaults are saved',async()=>{
 const db=environment({readError:true});const old=console.error;console.error=()=>{};
 let renderer;try{renderer=await mount();await flush();}finally{console.error=old;}
 assert.match(message(renderer),/No pudimos cargar/);assert.equal(db.writes,0);await act(async()=>renderer.unmount());
});

test('a quick edit followed by undo cannot resurrect a stale queued snapshot',async()=>{
 const db=environment();const renderer=await mount();await flush();
 const week=()=>renderer.root.findAll(node=>typeof node.type==='function' && node.type.name==='Semana')[0];
 await act(async()=>week().props.onAdd('2026-10-28','personal','Temporal'));
 const temporary=week().props.tasks.find(task=>task.text==='Temporal');
 await act(async()=>week().props.onDel(temporary.id));
 await flush();
 assert.equal(db.row.data.tasks.some(task=>task.text==='Temporal'),false);
 assert.equal(db.row.data.items.length,1);
 await act(async()=>renderer.unmount());
});
test('import validation and cancellation leave data intact; importing during a save remains serialized',async()=>{
 const db=environment();const renderer=await mount();await flush();
 const alerts=[],downloads=[];globalThis.alert=text=>alerts.push(text);
 globalThis.FileReader=class {readAsText(file){this.result=file.content;this.onload();}};
 const originalCreate=URL.createObjectURL, originalRevoke=URL.revokeObjectURL;
 URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test';};URL.revokeObjectURL=()=>{};
 globalThis.document={body:{appendChild(){}},createElement(){return {click(){},remove(){}};}};
 const input=()=>renderer.root.findAllByType('input').find(input=>input.props.accept==='application/json,.json');
 const select=async data=>act(async()=>input().props.onChange({target:{files:[{content:JSON.stringify(data)}],value:'file'}}));
 await select({areas:[{}]});await flush();assert.equal(db.writes,0);assert.match(alerts.pop(),/No se importó/);
 const imported=structuredClone(db.row.data);imported.items=[{...imported.items[0],id:'imported',title:'Libro importado'}];
 await select(imported);await flush();assert.equal(db.writes,0);assert.equal(downloads.length,0);
 let release;db.waitWrite=new Promise(resolve=>{release=resolve;});
 const week=renderer.root.findAll(node=>typeof node.type==='function' && node.type.name==='Semana')[0];
 await act(async()=>week.props.onAdd('2026-10-28','personal','Antes de importar'));await flush();
 assert.equal(db.writes,0);
 window.confirm=()=>true;await select(imported);
 assert.equal(downloads.length,1);
 const beforeImport=JSON.parse(await downloads[0].text());
 assert.equal(beforeImport.tasks.some(task=>task.text==='Antes de importar'),true,'pre-import download includes latest edits');
 db.waitWrite=null;release();await flush();
 assert.equal(db.row.data.items[0].title,'Libro importado');assert.equal(db.row.data.tasks.length,0);
 assert.match(message(renderer),/Guardado ·/);
 await act(async()=>renderer.unmount());URL.createObjectURL=originalCreate;URL.revokeObjectURL=originalRevoke;
});
