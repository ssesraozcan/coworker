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
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: unknown) => {
        (window as any).__shared = data;
      },
    });
  });
  await page
    .getByRole("button", { name: "Daveti paylaş", exact: true })
    .click();
  expect(await page.evaluate(() => (window as any).__shared.text)).toContain(
    "KIYI27",
  );
  await page.screenshot({ path: "../outputs/coworkers-v2-invite.png" });
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

test("four houses actually grow and settle on the island after Premium", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/premium");
  await page.getByRole("button", { name: "Yıllık Premium · ₺1.200" }).click();
  await page.getByRole("button", { name: "Demoyu dene" }).click();
  await page
    .locator('[data-testid="new-house-4"] svg')
    .waitFor({ state: "attached" });
  const samples = await page.evaluate(async () => {
    const values: number[][] = [[], [], [], []];
    for (let tick = 0; tick < 110; tick++) {
      for (let i = 0; i < 4; i++) {
        const element = document.querySelector(
          `[data-testid="new-house-${i + 1}"]`,
        )!;
        values[i].push(
          new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    return values;
  });
  for (const values of samples) {
    expect(Math.max(...values)).toBeGreaterThan(1.15);
    expect(values.at(-1)).toBeCloseTo(1, 1);
  }
  const peaks = samples.map((values) => values.findIndex((v) => v > 1.15));
  expect(peaks[1]).toBeGreaterThan(peaks[0]);
  expect(peaks[2]).toBeGreaterThan(peaks[1]);
  expect(peaks[3]).toBeGreaterThan(peaks[2]);
});

test("reduced motion shows all four houses without bounce", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/upgrade-success");
  await page
    .locator('[data-testid="new-house-4"] svg')
    .waitFor({ state: "attached" });
  for (let i = 1; i <= 4; i++)
    await expect(page.getByTestId(`new-house-${i}`)).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)",
    );
});

test("nine through twelve members use distinct island images", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("Günün sana ait.")).toBeVisible();
  const backgrounds: string[] = [];
  for (const members of [9, 10, 11, 12]) {
    await page.evaluate(
      (n) =>
        localStorage.setItem(
          "coworkers:world:v2",
          JSON.stringify({
            members: n,
            premium: "annual",
            code: "KIYI27",
            plans: [],
          }),
        ),
      members,
    );
    await page.goto("/world");
    await expect(
      page.getByText(`${members} / 12`, { exact: true }),
    ).toBeVisible();
    backgrounds.push(
      await page
        .locator("div")
        .evaluateAll(
          (nodes) =>
            nodes
              .map((n) => getComputedStyle(n).backgroundImage)
              .find((value) => value.startsWith("url(")) || "",
        ),
    );
  }
  expect(backgrounds.every(Boolean)).toBe(true);
  expect(new Set(backgrounds).size).toBe(4);
});

test("shared pergola zooms into its interior and reverses back to island", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/world");
  const hotspot = page.getByRole("button", {
    name: "Ortak çalışma alanına gir",
  });
  await expect(hotspot).toBeEnabled();
  await hotspot.click();
  const scales = await page.evaluate(async () => {
    const result: number[] = [];
    for (let i = 0; i < 35; i++) {
      const el = document.querySelector('[data-testid="island-camera"]')!;
      result.push(new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
      await new Promise((r) => setTimeout(r, 30));
    }
    return result;
  });
  expect(Math.max(...scales)).toBeGreaterThan(2);
  await expect(page.getByText("Masadaki yerin hazır.")).toBeVisible();
  await expect(page.getByTestId("commons-interior")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "../outputs/coworkers-commons-interior.png" });
  await page.getByRole("button", { name: "Adaya dön", exact: true }).click();
  await expect(hotspot).toBeEnabled();
  await expect(page.getByTestId("island-camera")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)",
  );
  await hotspot.click();
  await expect(page.getByText("Masadaki yerin hazır.")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Ortak çalışma hedefin" })
    .fill("Birlikte matematik");
  await page.getByRole("button", { name: "Birlikte odaklan" }).click();
  await expect(page.getByText("Birlikte matematik")).toBeVisible();
});
