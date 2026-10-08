// Add only this release's new physics deck/cards; existing card content is never updated.
// Deck metadata uses optimistic guards so a collaborator's intervening edit aborts the transaction.
const fs=require('node:fs');
const {cards,decks}=require('./export-cards.cjs');
const baseline=JSON.parse(require('node:child_process').execFileSync('git',['show','1289ad916345a05aab5eb8df279f88e4f9d9bcbd:db/cards.json'],{encoding:'utf8'}));
const sql=v=>v==null?'null':typeof v==='number'?String(v):Array.isArray(v)?(v.length?`array[${v.map(sql).join(', ')}]`:`'{}'::text[]`):`'${String(v).replace(/'/g,"''")}'`;
const deckCols=['id','subject','name','full_name','teacher','description','sort'];
const cardCols=['id','deck_id','kind','topic','badge','question','passage','answer','wrong','criteria','explanation','source_label','source_page','source_slide','source_url','sort'];
const added=cards.filter(c=>c.deck_id==='physics-ii');
const oldCards=new Map(baseline.cards.map(c=>[c.id,c]));
for(const c of cards.filter(c=>c.deck_id!=='physics-ii'))if(JSON.stringify(c)!==JSON.stringify(oldCards.get(c.id)))throw Error(`Existing card changed: ${c.id}`);
const fresh=decks.filter(d=>d.id==='physics-ii');
const insert=(table,rows,cols)=>`insert into public.${table} (${cols.join(', ')}) values\n${rows.map(r=>`  (${cols.map(c=>sql(r[c])).join(', ')})`).join(',\n')}\non conflict (id) do nothing;\n`;
let text='-- Physics II release patch: 72 choices + 18 written. No existing card updates/deletes.\n-- Run in the project SQL Editor after reviewing PR. Transaction aborts on conflicting content.\nbegin;\n\n';
text+=insert('decks',fresh,deckCols)+'\n'+insert('cards',added,cardCols);
text+='\ndo $verify$\nbegin\n';
for(const [table,rows,cols] of [['decks',fresh,deckCols],['cards',added,cardCols]])for(const row of rows){text+=`  if not exists (select 1 from public.${table} where ${cols.map(c=>`${c} is not distinct from ${sql(row[c])}`).join(' and ')}) then raise exception 'Conflicting ${table} id: ${row.id}'; end if;\n`;}
text+='end\n$verify$;\n\n';
for(const d of decks.filter(d=>d.id!=='physics-ii')){
 const old=baseline.decks.find(r=>r.id===d.id);if(JSON.stringify(d)===JSON.stringify(old))continue;
 const fields=deckCols.filter(c=>c!=='id');
 text+=`do $metadata$\nbegin\n  if not exists (select 1 from public.decks where id=${sql(d.id)} and (${fields.map(c=>`${c} is not distinct from ${sql(old[c])}`).join(' and ')})) and not exists (select 1 from public.decks where id=${sql(d.id)} and (${fields.map(c=>`${c} is not distinct from ${sql(d[c])}`).join(' and ')})) then raise exception 'Collaborator changed deck ${d.id}; review before applying'; end if;\nend\n$metadata$;\n`;
 text+=`update public.decks set ${fields.map(c=>`${c}=${sql(d[c])}`).join(', ')} where id=${sql(d.id)};\n\n`;
}
text+='commit;\n\n-- Verify: 72 choice, 18 written\nselect kind, count(*) from public.cards where deck_id=\'physics-ii\' group by kind;\n';
fs.writeFileSync('db/physics-release.sql',text);console.log('Wrote guarded add-only physics patch; all 926 existing cards unchanged.');
