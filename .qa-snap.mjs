
export default async function run(page, ui) {
  const r = {};
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await page.fill('input[name="email"]', "qa-admin@mekkybashmeil.test");
  await page.fill('input[name="password"]', "qa-test-pass-123");
  await page.locator('button[type=submit]').first().click();
  await page.waitForTimeout(4000);
  r.login = page.url();

  // wait LONG for dev compile
  await page.goto("http://localhost:3000/admin/services/new", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector('input[name="slug"]', { timeout: 60000 });
  r.formReady = true;

  await page.fill('input[name="slug"]', "qa-test-service");
  await page.fill('input[name="titleAr"]', "خدمة اختبار آلي");
  await page.fill('input[name="titleEn"]', "QA Test Service");
  await page.fill('textarea[name="excerptAr"]', "وصف اختبار آلي للخدمة.");
  await page.locator('button[type=submit]').first().click();
  await page.waitForTimeout(6000);
  r.urlAfter = page.url();
  r.success = await page.locator('[role=status]').allTextContents();
  r.alerts = await page.locator('[role=alert]').allTextContents();

  // verify in list
  await page.goto("http://localhost:3000/admin/services", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(3000);
  r.inList = (await page.content()).includes("خدمة اختبار آلي");

  // public
  await page.goto("http://localhost:3000/services", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(3000);
  r.public = (await page.content()).includes("خدمة اختبار آلي");
  return r;
}
