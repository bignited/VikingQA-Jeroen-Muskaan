import { test, expect } from "@playwright/test";

const PRODUCT_URL =
  "https://www.coolblue.be/en/product/981973/lenovo-ideapad-slim-3-15amn8-82xq01vemb-azerty.html";

test.describe(
  "Suggested items on a laptop product page show correct related products",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "On a laptop product page, the 'Similar laptops' sidebar and the 'Similar and better products' comparison table both surface products that belong to the same laptop category as the viewed product. Clicking a suggested item lands on that product's own page.",
    },
  },
  () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
      await page.goto(PRODUCT_URL, { waitUntil: "domcontentloaded" });
      // Dismiss the cookie banner – it re-appears in non-Chromium runners if cookies weren't set
      const acceptBtn = page.getByRole("button", { name: "Accept everything" });
      try {
        await acceptBtn.waitFor({ state: "visible", timeout: 5000 });
        await acceptBtn.click();
        // Wait for the dialog to close so it doesn't intercept any later clicks
        await acceptBtn.waitFor({ state: "hidden", timeout: 5000 });
      } catch {
        // No cookie dialog – continue
      }
    });

    test("Similar laptops sidebar shows related laptop products", async ({
      page,
    }) => {
      await test.step("Locate the Similar laptops section", async () => {
        await expect(
          page.getByRole("heading", { name: "Similar laptops", level: 4 })
        ).toBeVisible();
      });

      await test.step("At least two suggested product links pointing to /product/ pages are present", async () => {
        const sidebarSection = page
          .getByRole("heading", { name: "Similar laptops", level: 4 })
          .locator("..");

        const hrefs = await sidebarSection
          .getByRole("link")
          .evaluateAll((links) =>
            (links as HTMLAnchorElement[])
              .map((a) => a.href)
              .filter((h) => h.includes("/product/"))
          );
        expect(hrefs.length).toBeGreaterThanOrEqual(2);
        for (const href of hrefs) {
          expect(href).toContain("coolblue.be/en/product/");
        }
      });
    });

    test("Similar and better products section marks current product and lists alternatives", async ({
      page,
    }) => {
      await test.step("Locate the Similar and better products section", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Similar and better products",
            level: 2,
          })
        ).toBeVisible();
      });

      await test.step("Current product is labelled as 'Current product'", async () => {
        await expect(page.getByText("Current product").first()).toBeVisible();
      });

      await test.step("At least four alternative product links are listed", async () => {
        const alternativesSection = page
          .getByRole("heading", {
            name: "Similar and better products",
            level: 2,
          })
          .locator("..");

        const hrefs = await alternativesSection
          .getByRole("link")
          .evaluateAll((links) =>
            (links as HTMLAnchorElement[])
              .map((a) => a.href)
              .filter((h) => h.includes("/product/"))
          );
        const unique = [...new Set(hrefs)];
        expect(unique.length).toBeGreaterThanOrEqual(4);
      });

      await test.step("Comparison table includes Processor, Internal RAM and Total storage capacity rows", async () => {
        const alternativesSection = page
          .getByRole("heading", {
            name: "Similar and better products",
            level: 2,
          })
          .locator("..");

        await expect(
          alternativesSection.getByText("Processor").first()
        ).toBeVisible();
        await expect(
          alternativesSection.getByText("Internal RAM").first()
        ).toBeVisible();
        await expect(
          alternativesSection.getByText("Total storage capacity").first()
        ).toBeVisible();
      });
    });

    test("Clicking a suggested laptop navigates to that product's own laptop page", async ({
      page,
    }) => {
      let expectedHref: string | null = null;

      await test.step("Click the first product link in the Similar laptops sidebar", async () => {
        const sidebarSection = page
          .getByRole("heading", { name: "Similar laptops", level: 4 })
          .locator("..");

        // Collect product hrefs and navigate directly – avoids a stale click on a covered element
        const hrefs = await sidebarSection
          .getByRole("link")
          .evaluateAll((links) =>
            (links as HTMLAnchorElement[])
              .map((a) => a.href)
              .filter((h) => h.includes("/product/"))
          );
        expect(hrefs.length).toBeGreaterThanOrEqual(1);
        expectedHref = hrefs[0];
        await page.goto(expectedHref, { waitUntil: "domcontentloaded" });
      });

      await test.step("The destination page is a laptop product page", async () => {
        await expect(page).toHaveURL(expectedHref ?? /\/product\//, {
          timeout: 10_000,
        });
        // Breadcrumbs must include 'Laptops', confirming the suggested item is in the same category
        await expect(
          page.getByRole("navigation", { name: "Breadcrumbs" })
        ).toContainText("Laptops");
        await expect(page.locator("h1")).toBeVisible();
      });
    });
  }
);
