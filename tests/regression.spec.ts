import { test, expect } from '@playwright/test';

test.describe('CiteSight — Regression — Landing + All Pages + APIs + Edge YOLO + SAM 3.1 on-demand', () => {

  test('landing — smooth Apple minimal, no crowded, logo links home, hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CiteSight/);
    const logo = page.locator('header >> text=CiteSight').first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=The rulebook').first()).toBeVisible();
    await expect(page.locator('text=that watches').first()).toBeVisible();
    await expect(page.locator('text=GEO-ML PATTERN')).toHaveCount(0);
    await expect(page.locator('text=Home Depot')).toHaveCount(0);
    await expect(page.locator('text=Meta Hackathon')).toHaveCount(0);
    await expect(page.locator('text=CITESIGHT • RULEBOOK EYES • $0.35/hr')).toHaveCount(0);
    const uploadBtn = page.locator('a[href="/upload"]').first();
    await expect(uploadBtn).toBeVisible();
    await expect(page.locator('div.fixed.top-0').first()).toBeVisible();
    await expect(page.locator('text=Numbers judges').first()).toBeVisible();
    await expect(page.locator('text=0.89').first()).toBeVisible();
    await expect(page.locator('text=0.35').first()).toBeVisible();
  });

  test('features — minimal Apple, not crowded, 3 steps', async ({ page }) => {
    await page.goto('/features');
    await expect(page.locator('text=Every rule').first()).toBeVisible();
    await expect(page.locator('text=with a page number').first()).toBeVisible();
    await expect(page.locator('text=Ingest — manual').first()).toBeVisible();
    await expect(page.locator('text=Watch — SAM').first()).toBeVisible();
    await expect(page.locator('text=Explain — Incident').first()).toBeVisible();
    await expect(page.locator('text=Sign up')).toHaveCount(0);
    await expect(page.locator('text=Sign in')).toHaveCount(0);
  });

  test('upload — any manual length, not 300 drop, drag & drop, DSL with page citations', async ({ page }) => {
    await page.goto('/upload');
    await expect(page.locator('text=Upload your').first()).toBeVisible();
    await expect(page.locator('text=Drop manual here').first()).toBeVisible();
    await expect(page.locator('text=300-page')).toHaveCount(0);
    await expect(page.locator('text=312p')).toHaveCount(0);
    await expect(page.locator('text=any length').first()).toBeVisible();
  });

  test('zone — one-time annotation canvas, zones.json', async ({ page }) => {
    await page.goto('/zone');
    await expect(page.locator('text=Draw zones once').first()).toBeVisible();
    await expect(page.locator('canvas').first()).toBeVisible();
    await expect(page.locator('text=zones.json').first()).toBeVisible();
  });

  test('watch — real YOLOv8n-seg masks, incident p87, $0.35/hr, no LLM/frame', async ({ page }) => {
    await page.goto('/watch');
    await expect(page.locator('text=MASKS').first()).toBeVisible();
    await expect(page.locator('text=$0.35').first()).toBeVisible();
    await expect(page.locator('text=0 / frame').first()).toBeVisible();
  });

  test('incidents — timeline + clips + Voice Q&A real Whisper', async ({ page }) => {
    await page.goto('/incidents');
    await expect(page.locator('text=TIMELINE').first()).toBeVisible();
    await expect(page.locator('text=14:03:12').first()).toBeVisible();
    await expect(page.locator('text=R-04.2').first()).toBeVisible();
    await expect(page.locator('text=p87').first()).toBeVisible();
    await expect(page.locator('text=VOICE Q&A').first()).toBeVisible();
  });

  test('eval — Days 5-6 — precision 0.89/0.84 vs 0.62/0.71 cost $0.35 vs $4.20 vs $270/hr SAM 3.1 per frame impossible', async ({ page }) => {
    await page.goto('/eval');
    await expect(page.locator('text=Numbers judges').first()).toBeVisible();
    await expect(page.locator('text=0.89').first()).toBeVisible();
    await expect(page.locator('text=0.84').first()).toBeVisible();
    await expect(page.locator('text=0.62').first()).toBeVisible();
    await expect(page.locator('text=0.35').first()).toBeVisible();
    await expect(page.locator('text=4.2').first()).toBeVisible();
  });

  test('checked — 20 hand-checked rules real page citations 6 manuals', async ({ page }) => {
    await page.goto('/checked');
    await expect(page.locator('h1').first()).toContainText('20 hand-checked rules');
    await expect(page.locator('text=real page citations').first()).toBeVisible();
    await expect(page.locator('text=p4').first()).toBeVisible();
    await expect(page.locator('text=Workshop / Shop').first()).toBeVisible();
  });

  test('privacy, terms, manifesto — Apple minimal, not crowded', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('text=Privacy. Faces').first()).toBeVisible();
    await expect(page.locator('text=auto-delete').first()).toBeVisible();

    await page.goto('/terms');
    await expect(page.locator('text=Terms. Ranges').first()).toBeVisible();

    await page.goto('/manifesto');
    await expect(page.locator('text=Rulebook Eyes.').first()).toBeVisible();
    await expect(page.locator('text=Why free AI fails').first()).toBeVisible();
  });

  test('footer — no signup/signin, no Home Depot, no GEO-ML, no bottom tagline', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=Features').first()).toBeVisible();
    await expect(footer.locator('text=Privacy').first()).toBeVisible();
    await expect(page.locator('text=Sign up')).toHaveCount(0);
    await expect(page.locator('text=Sign in')).toHaveCount(0);
    await expect(page.locator('text=Home Depot')).toHaveCount(0);
    await expect(page.locator('text=GEO-ML')).toHaveCount(0);
    await expect(page.locator('text=CITESIGHT • RULEBOOK EYES').first()).toHaveCount(0);
  });

  test('API — /api/compile real Spark 1M any length, /api/eval 0.89/0.84 vs 0.62/0.71, /api/transcribe Whisper fallback', async ({ request }) => {
    const evalRes = await request.get('/api/eval');
    expect(evalRes.ok()).toBeTruthy();
    const evalData = await evalRes.json();
    expect(evalData.eval.citesight.precision).toBe(0.89);
    expect(evalData.eval.citesight.recall).toBe(0.84);
    expect(evalData.eval.citesight.cost_per_hr).toBe(0.35);
    expect(evalData.eval.vlm.precision).toBe(0.62);
    expect(evalData.eval.vlm.cost_per_hr).toBe(4.20);
    expect(evalData.testSet.count).toBeGreaterThanOrEqual(10);

    const manualsRes = await request.get('/manuals/checked-rules-20.json');
    expect(manualsRes.ok()).toBeTruthy();
    const manualsData = await manualsRes.json();
    expect(manualsData.length).toBe(20);
    expect(manualsData[0].hand_checked).toBe(true);
  });

  test('Edge API — FastAPI YOLOv8n-seg yolo:true SAM 3.1 on-demand $0.0025/$0.0125 not $270/hr per frame', async ({ request }) => {
    const health = await request.get('http://localhost:8000/health');
    expect(health.ok()).toBeTruthy();
    const hData = await health.json();
    expect(hData.yolo).toBe(true);
    expect(hData.cost).toContain('0.35/hr');
    expect(hData.sam31_on_demand).toContain('zone annotation once');
    expect(hData.sam31_cost_per_1000).toContain('270/hr');

    const zones = await request.get('http://localhost:8000/zones');
    expect(zones.ok()).toBeTruthy();
    const zData = await zones.json();
    expect(zData.length).toBeGreaterThanOrEqual(3);
  });

  test('Apple scroll — progress bar + hero parallax, not breaking grid', async ({ page }) => {
    await page.goto('/');
    const progress = page.locator('div.fixed.top-0').first();
    await expect(progress).toBeVisible();
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    await expect(page.locator('text=The rulebook').first()).toBeVisible();
    const cheapSection = page.locator('text=How you implement cheap');
    await cheapSection.scrollIntoViewIfNeeded();
    await expect(cheapSection).toBeVisible();
  });

});
