// Additive release only. Never overwrite a friend's existing cards or reuse an ID.
const fs=require('node:fs'),path=require('node:path');
const {decks,cards}=require('./export-cards.cjs');
const added=cards.filter(c=>/^(biology-(park|jo)-depth-|chemistry-depth-)/.test(c.id));
const chemistry=decks.find(d=>d.id==='chemistry');
if(added.length!==186 || !chemistry)throw new Error('Unexpected release scope');
const rows=JSON.stringify(added),deck=JSON.stringify([chemistry]);
if((rows+deck).includes('$release$'))throw new Error('SQL delimiter collision');
const sql=`-- 3.5.0: 82 biology choices + 15 rubrics; 76 chemistry choices + 13 rubrics.
-- Review the PR and run in Supabase SQL Editor. No UPDATE or DELETE of existing cards.
-- Run the whole transaction. Existing matching new IDs are safe; differing IDs abort.
begin;
create temporary table expected_science_decks on commit drop as
select * from jsonb_populate_recordset(null::public.decks, $release$${deck}$release$::jsonb);
create temporary table expected_science_cards on commit drop as
select * from jsonb_populate_recordset(null::public.cards, $release$${rows}$release$::jsonb);
do $$ begin
  if exists (select 1 from expected_science_decks e join public.decks d using(id)
    where (d.subject,d.name,d.full_name,d.teacher,d.description,d.sort)
      is distinct from (e.subject,e.name,e.full_name,e.teacher,e.description,e.sort)) then
    raise exception 'Chemistry deck already exists with different metadata; review before applying';
  end if;
  if exists (select 1 from expected_science_cards e join public.cards c using(id)
    where (c.deck_id,c.kind,c.topic,c.badge,c.question,c.passage,c.answer,c.wrong,c.criteria,c.explanation,c.source_label,c.source_page,c.source_slide,c.source_url,c.sort)
      is distinct from (e.deck_id,e.kind,e.topic,e.badge,e.question,e.passage,e.answer,e.wrong,e.criteria,e.explanation,e.source_label,e.source_page,e.source_slide,e.source_url,e.sort)) then
    raise exception 'New card ID already has different content; review before applying';
  end if;
end $$;
insert into public.decks (id,subject,name,full_name,teacher,description,sort)
select id,subject,name,full_name,teacher,description,sort from expected_science_decks
on conflict(id) do nothing;
insert into public.cards (id,deck_id,kind,topic,badge,question,passage,answer,wrong,criteria,explanation,source_label,source_page,source_slide,source_url,sort)
select id,deck_id,kind,topic,badge,question,passage,answer,wrong,criteria,explanation,source_label,source_page,source_slide,source_url,sort from expected_science_cards
on conflict(id) do nothing;
do $$ begin
  if (select count(*) from expected_science_cards e join public.cards c using(id)) <> 186 then
    raise exception 'Release card count mismatch';
  end if;
end $$;
commit;
-- Verify: biology-park 76 added, biology-jo 21 added, chemistry 89 added.
select deck_id,kind,count(*) from public.cards
where id like 'biology-park-depth-%' or id like 'biology-jo-depth-%' or id like 'chemistry-depth-%'
group by deck_id,kind order by deck_id,kind;
`;
fs.writeFileSync(path.join(__dirname,'../db/science-depth-release.sql'),sql);
console.log(`Exported additive science patch: ${added.length} cards, one new deck.`);
