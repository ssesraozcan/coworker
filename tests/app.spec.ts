import { test, expect } from "@playwright/test";
test("dashboard, plan persistence, world, copy and invitation validation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as any).__copied = text;
        },
      },
    });
  });
  await page.goto("/");
  await expect(page.getByText("Günün sana ait.")).toBeVisible();
  await page.getByRole("tab", { name: "Takvim", exact: true }).click();
  await page.getByRole("button", { name: "+ Çalışma planı ekle" }).click();
  await page
    .getByRole("textbox", { name: "Ne çalışacaksın?" })
    .fill("Analiz çalışması");
  await page.getByRole("button", { name: "Planı kaydet" }).click();
  await expect(
    page.getByText("Analiz çalışması").filter({ visible: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Analiz çalışması").filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Dünyam", exact: true }).click();
  await expect(page.getByRole("tab")).toHaveCount(0);
  await expect(page.getByText("İlk evim")).toBeVisible();
  await page.screenshot({ path: "../outputs/coworkers-v2-world.png" });
  await page
    .getByRole("button", { name: "Arkadaş davet et", exact: true })
    .click();
  await page.getByRole("button", { name: "Davet kodunu kopyala" }).click();
  await expect(page.getByText("✓ Davet kodu kopyalandı")).toBeVisible();
  await page.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: unknown) => { (window as any).__shared = data; } }); });
  await page.getByRole('button', {name:'Daveti paylaş',exact:true}).click();
  expect(await page.evaluate(() => (window as any).__shared.text)).toContain('KIYI27');
  await page.screenshot({path:'../outputs/coworkers-v2-invite.png'});
  await page.getByRole("button", { name: "Bir davet kodum var →" }).click();
  await page
    .getByRole("textbox", { name: "Davet kodu", exact: true })
    .fill("BAD");
  await page.getByRole("button", { name: "Daveti kabul et" }).click();
  await expect(page.getByText("Bu davet bulunamadı.")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Davet kodu", exact: true })
    .fill("KIYI27");
  await page.getByRole("button", { name: "Daveti kabul et" }).click();
  await expect(page.getByText("Hoş geldin, yeni komşu!")).toBeVisible();
  await page.getByRole("button", { name: "Adaya gir" }).click();
  await expect(
    page.getByText("2 / 8", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("capacity modal and premium plans change only through explicit demo confirmation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("Günün sana ait.")).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      "coworkers:world:v2",
      JSON.stringify({ members: 8, premium: null, code: "KIYI27", plans: [] }),
    ),
  );
  await page.goto("/world");
  await page
    .getByRole("button", { name: "Arkadaş davet et", exact: true })
    .click();
  await expect(page.getByText("Dünyan doldu.")).toBeVisible();
  await page.getByRole("button", { name: "Kapasiteyi genişlet" }).click();
  await page.getByRole("radio", { name: "Aylık plan" }).click();
  await expect(
    page.getByRole("button", { name: "Aylık Premium · ₺150" }),
  ).toBeVisible();
  await page.screenshot({ path: "../outputs/coworkers-v2-premium.png" });
  await page.getByRole("button", { name: "Aylık Premium · ₺150" }).click();
  await expect(
    page.getByText("Premium önizlemesi", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Demoyu dene" }).click();
  await expect(page.getByText("+4 yeni ev")).toBeVisible();
  await page.screenshot({ path: "../outputs/coworkers-v2-success.png" });
  await page.reload();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("coworkers:world:v2")!).premium,
    ),
  ).toBe("monthly");
});
