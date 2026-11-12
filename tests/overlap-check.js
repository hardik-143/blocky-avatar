// Overlap check for Blockling Studio.
// Builds the avatar for thousands of look combinations and animation frames and lists any two blocks
// that cut into each other by more than 3 cm. Run with: node tests/overlap-check.js  (needs Playwright)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 760 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.__STUDIO_TEST__ = true; });
  await p.goto('file://' + require('path').resolve(__dirname, '../studio/index.html')); await p.waitForTimeout(400);
  const res = await p.evaluate(() => {
    const S = window.__studio, bad = {}, note = (tag, r) => { for (const o of r) { const k = o.pair + ' (' + o.a + '/' + o.b + ')'; (bad[k] = bad[k] || { n: 0, max: 0, ex: tag }); bad[k].n++; if (o.depth > bad[k].max) { bad[k].max = o.depth; bad[k].ex = tag; } } };
    const HAIR = ["none","buzz","short","fringe","spiky","slick","curly","afro","bob","long","ponytail","bun","pigtails","mohawk","braids"];
    const HAT = ["none","cap","backcap","beanie","tophat","cowboy","crown","wizard","chef","party","headphones","bandana","helmet","catears","bunny","horns","halo","antenna","viking"];
    const HEADS = ["block","big","wide","tall","mini"], BODIES = ["classic","slim","broad","tall","short","chunky"];
    let n = 0;
    for (const hair of HAIR) for (const hat of HAT) for (const extra of [{}, { glasses: "goggles", acc: ["earrings", "scarf"], facial: "fullbeard" }, { facial: "beard", acc: ["earrings"] }]) for (const head of ["block", "wide", "tall"]) {
      S.setLook(Object.assign({ hair, hat, head }, extra)); note(`${hair}+${hat}+${head}+${JSON.stringify(extra)}`, S.overlaps(null, 0)); n++;
    }
    const TOPS = ["hoodie", "tee", "spacesuit", "dress", "robe", "jacket"], BACK = [[], ["backpack"], ["jetpack"], ["guitar"]];
    for (const top of TOPS) for (const hair of ["long", "braids", "ponytail", "pigtails", "afro"]) for (const bk of BACK) for (const more of [[], ["cape"], ["wings"], ["cape", "wings"], ["tail", "wings"], ["satchel", "scarf", "wristbands"]]) for (const body of ["classic", "chunky", "short", "tall"]) {
      S.setLook({ top, hair, body, acc: [...bk, ...more] }); note(`${top}+${hair}+${body}+${[...bk, ...more]}`, S.overlaps(null, 0)); n++;
    }
    const ANIMS = ["idle","walk","run","jump","wave","dance","robot","shuffle","wiggle","cheer","clap","bow","salute","point","laugh","shrug","facepalm","think","cry","angry","heart","flex","airguitar","kick","jacks","pushups","spin","stretch","sit","sleep","meditate","zombie"];
    const looks = [
      { hair: "afro", hat: "headphones", top: "hoodie", acc: ["backpack", "cape", "scarf", "wristbands", "earrings"], glasses: "goggles", facial: "fullbeard", bottom: "cargo", shoes: "slippers" },
      { hair: "long", hat: "cowboy", top: "dress", acc: ["wings", "satchel", "balloon"], body: "chunky", head: "big", shoes: "boots" },
    ];
    for (const L of looks) { S.setLook(L); for (const a of ANIMS) for (let i = 0; i < 8; i++) { note(`anim ${a} t=${(i * 0.37).toFixed(2)} look${looks.indexOf(L)}`, S.overlaps(a, i * 0.37 + 0.05)); n++; } }
    return { n, bad };
  });
  const rows = Object.entries(res.bad).sort((a, b) => b[1].max - a[1].max);
  console.log('checked rigs:', res.n, 'distinct overlap kinds:', rows.length, 'errors:', JSON.stringify(errs));
  for (const [k, v] of rows.slice(0, 40)) console.log(v.max.toFixed(3), v.n, k, '|', v.ex);
  await b.close();
})();
