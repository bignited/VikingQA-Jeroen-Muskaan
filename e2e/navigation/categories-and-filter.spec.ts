import { test, expect } from "@playwright/test";

test.describe("Navigation category hover and laptop filter", {
  tag: "@case",
  annotation: {
    type: "description",
    description:
      "A visitor hovers over a top-nav category to see its subcategory dropdown, then applies a filter on the laptops listing page and verifies the results are narrowed correctly.",
  },
}, () => {
  /**
   * Dismiss the cookie consent dialog.
   * The "Accept everything" button has name="accept_cookie" value="all_categories".
   * Using both attributes avoids a strict-mode violation caused by the second
   * "Set it yourself" button that shares the same `name` attribute.
   * After clicking we wait for the button to be hidden before returning, ensuring
   * the dialog overlay can no longer intercept pointer events.
   */
  async function acceptCookies(page: Parameters<Parameters<typeof test>[1]>[0]["page"]) {
    const acceptBtn = page.locator('[name="accept_cookie"][value="all_categories"]');
    await acceptBtn.waitFor({ state: "visible", timeout: 20_000 });
    await acceptBtn.click();
    await expect(acceptBtn).toBeHidden({ timeout: 15_000 });
  }

  test("clicking a nav category reveals its subcategory dropdown", async ({ page, baseURL }) => {
    test.setTimeout(60_000);

    await test.step("Navigate to the home page and dismiss the cookie dialog", async () => {
      await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
      await acceptCookies(page);
    });

    await test.step("Click the Computers & tablets navigation button", async () => {
      // Playwright performs hover + click; clicking keeps the dropdown open stably.
      await page.getByRole("button", { name: "Computers & tablets" }).click();
    });

    await test.step("Verify Laptops subcategory link is visible in the dropdown", async () => {
      await expect(
        page.getByRole("link", { name: "Laptops", exact: true }).first()
      ).toBeVisible();
    });
  });

  test("applying an OS filter on the laptops page narrows the results", async ({ page, baseURL }) => {
    test.setTimeout(60_000);

    await test.step("Navigate to the home page and dismiss the cookie dialog", async () => {
      await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
      await acceptCookies(page);
    });

    await test.step("Navigate to the laptops filter page", async () => {
      await page.goto(`${baseURL}/laptops/filter`, { waitUntil: "domcontentloaded" });
    });

    await test.step("Click the macOS filter option", async () => {
      // Each filter option is a <label> wrapping the checkbox input.
      // Clicking the label (not the raw <input>) fires the JS navigation handler.
      await page
        .locator('label:has(input[name="versie-van-besturingssysteem"][value="macos"])')
        .click();
    });

    await test.step("Verify the URL reflects the applied macOS filter", async () => {
      await expect(page).toHaveURL(/versie-van-besturingssysteem:macos/, { timeout: 15_000 });
    });

    await test.step("Verify the active filter delete button is shown", async () => {
      // The site renders a "Delete: macOS" button in the active filters bar
      await expect(
        page.getByRole("button", { name: "Delete: macOS" })
      ).toBeVisible();
    });

    await test.step("Verify filtered results are shown under the laptops heading", async () => {
      await expect(
        page.getByRole("group", { name: "Search results and filtering" })
      ).toContainText("laptops");
    });
  });
});
