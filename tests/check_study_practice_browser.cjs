const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.argv[2] || 'playwright');
const exported = JSON.parse(fs.readFileSync('db/cards.json', 'utf8'));
const base = process.env.JOHAMIN_TEST_URL || 'http://127.0.0.1:5175';
(async () => {
 const browser = await chromium.launch(process.argv[3] ? { executablePath: process.argv[3], headless: true } : { channel: 'chrome', headless: true });
 try {
  for (const size of [{width:1440,height:900},{width:390,height:844}]) {
   const page = await browser.newPage({ viewport:size, hasTouch:size.width===390, reducedMotion:'reduce' });
   const errors=[]; page.on('pageerror', e=>errors.push(e.message));
   await page.route('**/rest/v1/cards?**', route => { const url=new URL(route.request().url()); const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||1000); return route.fulfill({json:exported.cards.slice(offset,offset+limit)}); });
   const enter=async()=>{await page.goto(base);await page.locator('.intro.is-ready .intro-button').click();await page.locator('.intro').waitFor({state:'detached'});};
   const press=async key=>{await page.keyboard.press(key);};
   const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), 'Horizontal overflow at '+size.width);
   await enter();
   for (const key of ['ArrowRight','ArrowUp','ArrowRight','ArrowRight','ArrowUp']) await press(key);
   await page.getByRole('button',{name:'↑ 뒤집기'}).waitFor();
   assert.ok((await page.locator('body').innerText()).includes('1 / 22'));
   // Swipe left: mark this term for another pass, then advance.
   const box=await page.locator('.menu-board .swipe-card').boundingBox();
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2-100,box.y+box.height/2,{steps:8});await page.mouse.up();
   assert.ok((await page.locator('body').innerText()).includes('2 / 23'));
   await press('Escape');await press('ArrowLeft');
   await page.getByRole('button',{name:'작은 조각',exact:true}).click();
   assert.equal(await page.getByRole('button',{name:'작은 조각',exact:true}).getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'낱말',exact:true}).click();
   assert.equal(await page.getByRole('button',{name:'낱말',exact:true}).getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('.order-slot.is-empty').count(),1);
   await page.locator('.order-piece').first().click();
   assert.equal(await page.locator('.order-slot.is-filled').count(),1);
   await noOverflow();
   if(process.argv[4])await page.screenshot({path:process.argv[4]+'/order-'+size.width+'.png',fullPage:true});
   await press('Escape');await press('ArrowRight');
   await page.locator('#vocabulary-answer').fill('상동염색체의 특정한 같은 위치에 존재하며, 하나의 유전 형질을 결정하는 서로 다른 유전자이다. 상동염색체 위에 쌍으로 존재하는 대립유전자는 같을 수도 있고 다를 수도 있다.');
   await press('Enter');await page.getByText('원문 그대로! 완벽해요',{exact:false}).waitFor();
   assert.ok(await page.evaluate(()=>Boolean(JSON.parse(localStorage.getItem('johamin-park-vocabulary-v1')).xp)));
   await enter();for(const key of ['ArrowLeft','ArrowLeft','ArrowLeft','ArrowRight','ArrowRight','ArrowUp'])await press(key);
   await page.locator('#written-answer').waitFor();
   const first=exported.cards.find(c=>c.id==='practice-short-social-001');
   await page.locator('#written-answer').fill(first.answer);await press('Enter');
   await page.getByText('정답이에요!',{exact:true}).waitFor();
   await page.getByRole('button',{name:'다음 →',exact:true}).click();
   await page.locator('#written-answer').fill('모르겠다');await press('Enter');
   await page.getByText('정답을 확인하고 다시 써 보세요.',{exact:true}).waitFor();
   await noOverflow();
   if(process.argv[4])await page.screenshot({path:process.argv[4]+'/short-'+size.width+'.png',fullPage:true});
   assert.deepEqual(errors,[]);await page.close();
   console.log('PASS '+size.width+'x'+size.height+': full vocabulary, swipe, piece sizes, definition grade, progress, short correct/incorrect, layout, no browser errors.');
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
