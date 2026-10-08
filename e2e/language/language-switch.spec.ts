import { test, expect } from "@playwright/test";

const NL_URL = "https://www.coolblue.nl";

test.describe("A visitor switches the website language to English", {
  tag: "@case",
  annotation: {
    type: "description",
    description:
      "A visitor on the Dutch Coolblue homepage clicks the English link and verifies that the page is served in English — the URL switches to /en, the page title is in English, and the navigation categories are displayed in English.",
  },
}, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await test.step("Open the Dutch homepage with the cookie dialog suppressed", async () => {
      // Suppress the cookie dialog before any page script runs so it never blocks interaction
      await page.addInitScript(() => {
        HTMLDialogElement.prototype.showModal = function () { /* suppressed */ };
      });
      await page.goto(NL_URL, { waitUntil: "domcontentloaded" });
    });
  });

  test("switches to the English version via the language link", async ({ page }) => {
    await test.step("Click the English language link in the header", async () => {
      await page.getByRole("link", { name: "English", exact: true }).click();
    });

    await test.step("Verify the URL changes to the English path", async () => {
      await expect(page).toHaveURL(/\/en/);
    });

    await test.step("Verify the page title is in English", async () => {
      await expect(page).toHaveTitle("Coolblue - Anything for a smile");
    });
  });

  test("shows the navigation in English after switching", async ({ page }) => {
    await test.step("Switch to English", async () => {
      await page.getByRole("link", { name: "English", exact: true }).click();
      await page.waitForURL(/\/en/);
    });

    await test.step("Verify main navigation categories are in English", async () => {
      await expect(
        page.getByRole("button", { name: "Computers & tablets" })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Gaming" })
      ).toBeVisible();
    });
  });
});
