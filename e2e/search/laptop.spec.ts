import { test, expect } from "@playwright/test";

test("navigate to laptops from Computers & tablets", async ({
  page,
  baseURL,
}) => {
  await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Accept everything" }).click();
  await page.getByRole("button", { name: "Computers & tablets" }).click();
  await page.getByRole("link", { name: "Laptops", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Laptops");
});
