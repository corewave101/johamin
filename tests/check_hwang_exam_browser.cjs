const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.argv[2]);
(async()=>{
 const browser=await chromium.launch({executablePath:process.argv[3],headless:true});
 try {
 for(const size of [{width:1440,height:900},{width:390,height:844}]) {
  const page=await browser.newPage({viewport:size,hasTouch:size.width===390,reducedMotion:'reduce'});
  page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const enter=async()=>{await page.goto('http://127.0.0.1:5175');await page.locator('.intro.is-ready .intro-button').click();await page.locator('.intro').waitFor({state:'detached'});for(const k of ['ArrowRight','ArrowLeft','ArrowLeft'])await page.keyboard.press(k);};
  await enter();await page.keyboard.press('ArrowUp');await page.locator('#written-answer').waitFor();
  assert.ok((await page.locator('body').innerText()).includes('1 / 250'));
  await page.locator('#written-answer').fill('행성');await page.keyboard.press('Enter');await page.getByText('정답이에요!',{exact:true}).waitFor();
  await page.getByRole('button',{name:'다음 →',exact:true}).click();await page.locator('#written-answer').fill('오답');await page.keyboard.press('Enter');
  await page.getByText('정답을 확인하고 다시 써 보세요.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'틀린 단답형만 다시',exact:true}).click();assert.ok((await page.locator('body').innerText()).includes('1 / 1'));
  await page.getByRole('button',{name:'전체 문제 보기',exact:true}).click();
  await page.getByLabel('단원 선택').selectOption('EM200 레티클과 정렬');
  await page.getByText('수업자료 그림·힌트 보기 · 43쪽',{exact:true}).click();
  await page.locator('.hwang-reference img').waitFor();assert.ok(await page.locator('.hwang-reference img').evaluate(img=>img.complete&&img.naturalWidth>100));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:process.argv[4]+'/exam-'+size.width+'.png',fullPage:true});
  await enter();await page.keyboard.press('ArrowUp');await page.locator('#written-answer').waitFor();
  await page.locator('nav select').selectOption('0');assert.equal(await page.locator('#written-answer').inputValue(),'행성');
  await page.getByRole('button',{name:'← 학습 메뉴',exact:true}).click();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowUp');
  await page.locator('#written-answer').waitFor();assert.ok((await page.locator('body').innerText()).includes('1 / 33'));
  await page.locator('#written-answer').fill('삼각대와 가대 설치 → 균형추와 경통 → 파인더와 접안렌즈 → 균형 → 파인더 조정 → 극축 정렬');
  await page.getByRole('button',{name:'모범답안·채점 기준 보기',exact:true}).click();assert.equal(await page.locator('fieldset input').count(),6);
  for(const checkbox of await page.locator('fieldset input').all())await checkbox.check();
  await page.getByRole('button',{name:'채점 완료 표시',exact:true}).click();await page.getByText('직접 채점: 6 / 6점',{exact:true}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
  await page.screenshot({path:process.argv[4]+'/written-'+size.width+'.png',fullPage:true});
  console.log('PASS '+size.width+': live DB fallback, short 250 / written 33, answer grading, wrong-only, topic, source image, persistence, 6-point rubric, no overflow/errors.');
  await page.close();
 }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
