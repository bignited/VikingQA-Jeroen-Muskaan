import { test, expect } from "@playwright/test";

test.describe("Clicking the logo navigates to the home page", {
  tag: "@case",
  annotation: {
    type: "description",
    description:
      "A visitor on an inner page clicks the Coolblue logo and is taken back to the home page.",
  },
}, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Accept everything" }).click();
  });

  test("logo is visible and links to the home page", async ({ page }) => {
    await test.step("Check the logo link points to the home page", async () => {
      const logo = page.getByRole("link", { name: "Back to the Coolblue home page" });
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("href", "/en/");
    });
  });

  test("clicking the logo from an inner page returns to the home page", async ({ page, baseURL }) => {
    await test.step("Navigate to an inner page", async () => {
      await page.getByRole("button", { name: "Computers & tablets" }).click();
      await page.getByRole("link", { name: "Laptops", exact: true }).click();
      await expect(page.locator("h1")).toContainText("Laptops");
    });

    await test.step("Click the Coolblue logo", async () => {
      await page.getByRole("link", { name: "Back to the Coolblue home page" }).click();
    });

    await test.step("Verify the home page is shown", async () => {
      await expect(page).toHaveURL(baseURL!);
      await expect(page.locator("h1")).toContainText("Coolblue");
    });
  });
});
