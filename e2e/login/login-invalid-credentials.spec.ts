import { test, expect } from "@playwright/test";

test.describe("Login with invalid credentials displays an appropriate error message", {
  tag: "@case",
  annotation: {
    type: "description",
    description: "A user who enters invalid credentials on the training application login form is not authenticated and sees an error message indicating the credentials are incorrect.",
  },
}, () => {
  test("shows an error message when invalid credentials are submitted", async ({ page, baseURL }) => {
    await test.step("Start from the homepage and accept cookies", async () => {
      await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "Accept everything" }).click();
    });

    await test.step("Navigate to the training application login page", async () => {
      await page.goto("http://training-frontend-angular.s3-website-eu-west-1.amazonaws.com/");
    });

    await test.step("Enter invalid username and password", async () => {
      await page.locator("#input-username").fill("wronguser");
      await page.locator("#input-password").fill("wrongpass");
    });

    await test.step("Submit the login form", async () => {
      await page.locator("#button-login").click();
    });

    await test.step("Verify the user remains on the login page and sees an error", async () => {
      await expect(page.getByText("Incorrect Credentials")).toBeVisible();
      await expect(page.locator("#button-login")).toBeVisible();
    });
  });
});
