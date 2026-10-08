import { test, expect } from "@playwright/test";

test.describe("A user navigates to the rickroll video on YouTube", {
  tag: "@case",
  annotation: {
    type: "description",
    description: "A user starts at the Coolblue homepage and navigates to the Rick Astley Never Gonna Give You Up video on YouTube, verifying the video title is displayed correctly.",
  },
}, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
    const acceptButton = page.getByRole("button", { name: "Accept everything" });
    if (await acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptButton.click();
    }
  });

  test("navigates to the YouTube rickroll video and checks the title", async ({ page }) => {
    await test.step("Navigate to the rickroll video on YouTube", async () => {
      await page.goto("https://www.youtube.com/watch?v=dQw4w9WgXcQ", { waitUntil: "domcontentloaded" });
    });

    await test.step("Verify the video title is shown", async () => {
      await expect(
        page.getByRole("heading", { name: "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)", level: 1 })
      ).toBeVisible();
    });
  });
});
