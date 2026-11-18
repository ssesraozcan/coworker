import { test, expect } from "@playwright/test";
test("routine target persists and updates both profile and dashboard", async ({
  page,
}) => {
  await page.goto("/profile");
  await page
    .getByRole("button", { name: "Rutinimi düzenle", exact: true })
    .click();
  await page.getByRole("radio", { name: "90 dakika", exact: true }).click();
  await page.getByRole("checkbox", { name: "Paz", exact: true }).click();
  await page
    .getByRole("button", { name: "Rutinimi kaydet", exact: true })
    .click();
  await expect(
    page.getByText("90 dakika", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("90 dakika", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Günüm", exact: true }).click();
  await expect(page.getByText("0 / 90 dakika", { exact: true })).toBeVisible();
});
test("game nav is separate and closet changes filters and three column view", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/world");
  await page.getByRole("tab", { name: "Dolabım", exact: true }).click();
  await expect(
    page.getByText("Dolabım", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Filtreleri kapat" }).click();
  await expect(page.getByTestId("closet-filters")).toHaveCount(0);
  await page.getByRole("button", { name: "Filtreleri aç" }).click();
  await page.getByRole("tab", { name: "Keşfet", exact: true }).click();
  await page.getByRole("button", { name: "Liste görünümüne geç" }).click();
  await expect(page.getByTestId("closet-grid")).toBeVisible();
  await expect(page.getByTestId("object-lock-2")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Eşyalarında ara" })
    .fill("Devetabanı");
  await expect(
    page.getByRole("button", { name: "Devetabanı", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Ana sayfaya dön", exact: true })
    .click();
  await expect(page.getByText("Günün sana ait, Esra.")).toBeVisible();
  expect(errors).toEqual([]);
});
test("owned object can be placed in a home and persists", async ({ page }) => {
  await page.goto("/closet");
  await page.getByRole("button", { name: "Liste görünümüne geç" }).click();
  await page.getByRole("button", { name: "Devetabanı", exact: true }).click();
  await page.getByRole("button", { name: "Yerleştireceğim alanı seç" }).click();
  await page
    .getByRole("button", { name: "Evime yerleştir", exact: true })
    .click();
  await page
    .getByTestId("placement-surface")
    .click({ position: { x: 180, y: 380 } });
  await page.getByRole("button", { name: "Buraya yerleştir" }).click();
  await expect(page.getByLabel("Yerleştirdiğin eşya")).toBeVisible({
    timeout: 20000,
  });
  await page.reload();
  await expect(page.getByLabel("Yerleştirdiğin eşya")).toBeVisible({
    timeout: 20000,
  });
});
test("dashboard weekly calendar stays in place when cards scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const fixed = page.getByTestId("fixed-dashboard-calendar");
  await expect(fixed).toBeVisible();
  const before = await fixed.boundingBox();
  await page.getByTestId("dashboard-cards").evaluate((el) => {
    el.scrollTop = 200;
  });
  const after = await fixed.boundingBox();
  expect(after!.y).toBe(before!.y);
});
