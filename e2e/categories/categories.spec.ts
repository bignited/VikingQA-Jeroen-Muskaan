import { test, expect } from "@playwright/test";

test.describe("Computers & tablets category page", {
  tag: "@case",
  annotation: {
    type: "description",
    description:
      "The Computers & tablets category page shows the correct heading and its subcategories are accurate and relevant to computers and tablets.",
  },
}, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/computers-tablets`, {
      waitUntil: "domcontentloaded",
    });
  });

  test("category heading matches the category", async ({ page }) => {
    await test.step("Verify the page heading says Computers & tablets", async () => {
      await expect(page.locator("h1")).toHaveText("Computers & tablets");
    });
  });

  test("main product subcategories are present and correctly labelled", async ({ page }) => {
    await test.step("Verify Laptops, Tablets, Desktops and Monitors subcategory links are visible", async () => {
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: "Laptops", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Tablets", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Desktops", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Monitors", exact: true }).first()).toBeVisible();
    });
  });

  test("printer and computer accessory subcategories are present", async ({ page }) => {
    await test.step("Verify the Printers and computer accessories section heading", async () => {
      await expect(page.getByRole("heading", { name: "Printers and computer accessories", level: 2 })).toBeVisible();
    });

    await test.step("Verify subcategory links in the Printers and computer accessories section", async () => {
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: "Printers", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "All laptop accessories", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Computer parts", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Network & internet", exact: true }).first()).toBeVisible();
    });
  });

  test("tablet accessory subcategories are present", async ({ page }) => {
    await test.step("Verify the Tablet accessories section heading", async () => {
      await expect(page.getByRole("heading", { name: "Tablet accessories", level: 2 })).toBeVisible();
    });

    await test.step("Verify subcategory links in the Tablet accessories section", async () => {
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: "Tablet covers", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Tablet screen protectors", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Tablet mounts", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "All tablet accessories", exact: true }).first()).toBeVisible();
    });
  });

  test("clicking Laptops subcategory navigates to the Laptops page", async ({ page }) => {
    await test.step("Click the Laptops subcategory link", async () => {
      await page.locator("main").getByRole("link", { name: "Laptops", exact: true }).first().click();
    });

    await test.step("Verify the Laptops page heading is displayed", async () => {
      await expect(page.locator("h1")).toContainText("Laptops");
    });
  });

  test("clicking Tablets subcategory navigates to the Tablets page", async ({ page }) => {
    await test.step("Click the Tablets subcategory link", async () => {
      await page.locator("main").getByRole("link", { name: "Tablets", exact: true }).first().click();
    });

    await test.step("Verify the Tablets page heading is displayed", async () => {
      await expect(page.locator("h1")).toContainText("Tablets");
    });
  });
});

test.describe("Telephony category page", {
  tag: "@case",
  annotation: {
    type: "description",
    description:
      "The Telephony category page shows the correct heading and its subcategories are relevant to telephony products.",
  },
}, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}/telephony`, {
      waitUntil: "domcontentloaded",
    });
  });

  test("category heading matches the category", async ({ page }) => {
    await test.step("Verify the page heading says Telephony", async () => {
      await expect(page.locator("h1")).toHaveText("Telephony");
    });
  });

  test("main telephony subcategories are present and correctly labelled", async ({ page }) => {
    await test.step("Verify Smartphones and Landline phones subcategory links are visible", async () => {
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: "Smartphones", exact: true }).first()).toBeVisible();
      await expect(main.getByRole("link", { name: "Landline phones", exact: true }).first()).toBeVisible();
    });
  });

  test("clicking Smartphones subcategory navigates to the Smartphones page", async ({ page }) => {
    await test.step("Click the Smartphones subcategory link", async () => {
      await page.locator("main").getByRole("link", { name: "Smartphones", exact: true }).first().click();
    });

    await test.step("Verify the Smartphones page heading is displayed", async () => {
      await expect(page.locator("h1")).toContainText("Smartphones");
    });
  });
});
