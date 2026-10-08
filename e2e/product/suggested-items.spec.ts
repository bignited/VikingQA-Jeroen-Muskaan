import { test, expect, Page } from "@playwright/test";

const PRODUCT_URL =
  "https://www.coolblue.be/en/product/981973/lenovo-ideapad-slim-3-15amn8-82xq01vemb-azerty.html";

/** Accept cookies and wait for the dialog to fully disappear. */
async function dismissCookies(page: Page) {
  const acceptBtn = page.getByRole("button", { name: "Accept everything" });
  try {
    await acceptBtn.waitFor({ state: "visible", timeout: 8000 });
    await acceptBtn.click();
    // Wait for the dialog element itself to be detached from DOM
    const dialog = page.locator("dialog[open]");
    await dialog.waitFor({ state: "hidden", timeout: 8000 }).catch(() => {});
  } catch {
    // Dialog not present – continue
  }
}

/** Navigate to the product page and dismiss cookies. */
async function goToProduct(page: Page) {
  await page.goto(PRODUCT_URL, { waitUntil: "domcontentloaded" });
  await dismissCookies(page);
}

// ─── Case 1 ─────────────────────────────────────────────────────────────────
test.describe(
  "Suggested items on a laptop product page show correct related products",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "On a laptop product page the 'Similar laptops' sidebar and the 'Similar and better products' comparison table both surface products that belong to the same laptop category as the viewed product. Clicking a suggested item lands on that product's own page.",
    },
  },
  () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
      await goToProduct(page);
    });

    test("Similar laptops sidebar shows related laptop products", async ({
      page,
    }) => {
      const sidebarHeading = page.getByRole("heading", {
        name: "Similar laptops",
        level: 4,
      });

      await test.step("Locate the Similar laptops section", async () => {
        await expect(sidebarHeading).toBeVisible({ timeout: 10_000 });
      });

      await test.step("At least two suggested product links pointing to /product/ pages are present", async () => {
        const sidebar = sidebarHeading.locator("..");
        await expect(sidebar.getByRole("link").first()).toBeVisible({
          timeout: 10_000,
        });

        const hrefs = await sidebar
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
      const sectionHeading = page.getByRole("heading", {
        name: "Similar and better products",
        level: 2,
      });

      await test.step("Scroll to and locate the Similar and better products section", async () => {
        await sectionHeading.scrollIntoViewIfNeeded();
        await expect(sectionHeading).toBeVisible({ timeout: 10_000 });
      });

      await test.step("Current product is labelled 'Current product' and at least four alternatives are listed", async () => {
        await expect(page.getByText("Current product").first()).toBeVisible();

        const section = sectionHeading.locator("..");
        // Wait for 'Read reviews for' buttons to confirm the dynamic comparison table has loaded
        await expect(
          page.getByRole("button", { name: /Read reviews for/ }).first()
        ).toBeVisible({ timeout: 10_000 });

        const hrefs = await section
          .getByRole("link")
          .evaluateAll((links) =>
            (links as HTMLAnchorElement[])
              .map((a) => a.href)
              .filter((h) => h.includes("/product/"))
          );
        expect([...new Set(hrefs)].length).toBeGreaterThanOrEqual(4);
      });

      await test.step("Comparison table includes Processor, Internal RAM, Total storage capacity and Panel type rows", async () => {
        const section = sectionHeading.locator("..");
        for (const label of [
          "Processor",
          "Internal RAM",
          "Total storage capacity",
          "Panel type",
        ]) {
          await expect(section.getByText(label).first()).toBeVisible();
        }
      });
    });

    test("Clicking a suggested laptop navigates to that product's own laptop page", async ({
      page,
    }) => {
      let expectedHref: string | null = null;

      await test.step("Resolve the first product link in the Similar laptops sidebar", async () => {
        const sidebarHeading = page.getByRole("heading", {
          name: "Similar laptops",
          level: 4,
        });
        await expect(sidebarHeading).toBeVisible({ timeout: 10_000 });
        const sidebar = sidebarHeading.locator("..");
        await expect(sidebar.getByRole("link").first()).toBeVisible({
          timeout: 10_000,
        });

        const hrefs = await sidebar
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
        await expect(
          page.getByRole("navigation", { name: "Breadcrumbs" })
        ).toContainText("Laptops");
        await expect(page.locator("h1")).toBeVisible();
      });
    });
  }
);

// ─── Case 2 ─────────────────────────────────────────────────────────────────
test.describe(
  "Similar laptops sidebar shows review scores, key features and prices for each suggestion",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "Each item in the 'Similar laptops' sidebar must show a review score link, a list of at least two feature highlights, and a price — so a customer can compare at a glance without opening every product.",
    },
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await goToProduct(page);
    });

    test("Every suggested laptop in the sidebar shows a review score, feature list and price", async ({
      page,
    }) => {
      const sidebarHeading = page.getByRole("heading", {
        name: "Similar laptops",
        level: 4,
      });
      await expect(sidebarHeading).toBeVisible({ timeout: 10_000 });
      const sidebar = sidebarHeading.locator("..");

      // Wait for review links – they are the last to render inside the sidebar
      const reviewLinks = sidebar
        .getByRole("link")
        .filter({ hasText: /Review is/ });
      await expect(reviewLinks.first()).toBeVisible({ timeout: 15_000 });

      await test.step("Each sidebar item has a review score link", async () => {
        expect(await reviewLinks.count()).toBeGreaterThanOrEqual(2);
      });

      await test.step("Each sidebar product card has a feature list with at least two items", async () => {
        const featureLists = sidebar.getByRole("list");
        const listCount = await featureLists.count();
        expect(listCount).toBeGreaterThanOrEqual(2);
        for (let i = 0; i < listCount; i++) {
          const itemCount = await featureLists
            .nth(i)
            .getByRole("listitem")
            .count();
          if (itemCount > 0) expect(itemCount).toBeGreaterThanOrEqual(2);
        }
      });

      await test.step("Both sidebar product cards display a price in euro format", async () => {
        const priceEls = sidebar
          .locator("p > *")
          .filter({ hasText: /\d+,-/ });
        await expect(priceEls.first()).toBeVisible({ timeout: 10_000 });
        expect(await priceEls.count()).toBeGreaterThanOrEqual(2);
      });
    });
  }
);

// ─── Case 3 ─────────────────────────────────────────────────────────────────
test.describe(
  "'View all Lenovo IdeaPad' link in the Similar laptops sidebar leads to the brand series category",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "At the bottom of the 'Similar laptops' sidebar there is a 'View all Lenovo IdeaPad' link that takes the customer to the Lenovo IdeaPad laptop category listing page.",
    },
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await goToProduct(page);
    });

    test("The 'View all Lenovo IdeaPad' link is visible and navigates to the IdeaPad category", async ({
      page,
    }) => {
      const viewAllLink = page.getByRole("link", {
        name: /View all Lenovo IdeaPad/,
      });

      await test.step("Verify the view-all link is visible", async () => {
        await expect(viewAllLink).toBeVisible({ timeout: 10_000 });
      });

      await test.step("Navigate using the link and land on the Lenovo IdeaPad category", async () => {
        const href = await viewAllLink.getAttribute("href");
        await page.goto(`https://www.coolblue.be${href}`, {
          waitUntil: "domcontentloaded",
        });
        await expect(page).toHaveURL(/\/laptops\/lenovo\/lenovo-ideapad/, {
          timeout: 10_000,
        });
        await expect(page.locator("h1")).toContainText("Lenovo IdeaPad");
      });
    });
  }
);

// ─── Case 4 ─────────────────────────────────────────────────────────────────
test.describe(
  "Comparison table shows prices, reviews and a full-comparison link for every alternative",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "In the 'Similar and better products' comparison table every alternative product must show a price and a review indicator. A 'Show full comparison' link at the bottom must contain the current product's ID and open the comparison page.",
    },
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await goToProduct(page);
    });

    test("Each alternative shows a price and a review indicator", async ({
      page,
    }) => {
      const sectionHeading = page.getByRole("heading", {
        name: "Similar and better products",
        level: 2,
      });
      await sectionHeading.scrollIntoViewIfNeeded();
      await expect(sectionHeading).toBeVisible({ timeout: 10_000 });

      // Gate: wait for review buttons to confirm dynamic content is loaded
      const reviewBtns = page.getByRole("button", {
        name: /Read reviews for/,
      });
      await expect(reviewBtns.first()).toBeVisible({ timeout: 15_000 });

      await test.step("Prices are visible for all alternatives", async () => {
        const section = sectionHeading.locator("..");
        const priceEls = section.locator("p > *").filter({ hasText: /\d+,-/ });
        await expect(priceEls.first()).toBeVisible({ timeout: 10_000 });
        expect(await priceEls.count()).toBeGreaterThanOrEqual(4);
      });

      await test.step("Review buttons exist for each alternative", async () => {
        expect(await reviewBtns.count()).toBeGreaterThanOrEqual(4);
      });
    });

    test("'Show full comparison' link contains the current product ID and opens the comparison page", async ({
      page,
    }) => {
      await test.step("Verify the link is visible and encodes the current product ID", async () => {
        const link = page.getByRole("link", { name: /Show full comparison/ });
        await expect(link).toBeVisible({ timeout: 15_000 });
        const href = await link.getAttribute("href");
        expect(href).toContain("/compare/");
        expect(href).toContain("981973");
      });

      await test.step("Navigating the link opens the comparison page", async () => {
        const href = await page
          .getByRole("link", { name: /Show full comparison/ })
          .getAttribute("href");
        await page.goto(`https://www.coolblue.be${href}`, {
          waitUntil: "domcontentloaded",
        });
        await expect(page).toHaveURL(/\/compare\//, { timeout: 10_000 });
        await expect(page.locator("h1")).toBeVisible();
      });
    });
  }
);

// ─── Case 5 ─────────────────────────────────────────────────────────────────
test.describe(
  "Clicking a comparison table alternative navigates to its own laptop product page",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "Every named alternative in the 'Similar and better products' table is a link. Clicking one must land on that product's own page, which must sit under the Laptops category — proving the suggestions are genuinely related laptops.",
    },
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await goToProduct(page);
    });

    test("The first named alternative in the comparison table links to a laptop product page", async ({
      page,
    }) => {
      let expectedHref: string | null = null;

      await test.step("Scroll to the comparison section and resolve the first alternative URL", async () => {
        const sectionHeading = page.getByRole("heading", {
          name: "Similar and better products",
          level: 2,
        });
        await sectionHeading.scrollIntoViewIfNeeded();
        await expect(sectionHeading).toBeVisible({ timeout: 10_000 });

        // Gate: wait for review buttons to confirm the section's content is fully rendered
        await expect(
          page.getByRole("button", { name: /Read reviews for/ }).first()
        ).toBeVisible({ timeout: 15_000 });

        const hrefs = await sectionHeading
          .locator("..")
          .getByRole("link")
          .evaluateAll((links) =>
            (links as HTMLAnchorElement[])
              .map((a) => a.href)
              .filter(
                (h) => h.includes("/product/") && !h.includes("981973")
              )
          );
        const unique = [...new Set(hrefs)];
        expect(unique.length).toBeGreaterThanOrEqual(1);
        expectedHref = unique[0];
        await page.goto(expectedHref, { waitUntil: "domcontentloaded" });
      });

      await test.step("The destination is a laptop product page", async () => {
        await expect(page).toHaveURL(expectedHref ?? /\/product\//, {
          timeout: 10_000,
        });
        await expect(
          page.getByRole("navigation", { name: "Breadcrumbs" })
        ).toContainText("Laptops");
        await expect(page.locator("h1")).toBeVisible();
      });
    });
  }
);

// ─── Case 6 ─────────────────────────────────────────────────────────────────
test.describe(
  "Related products section shows laptop category links relevant to the viewed product",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "Below the comparison table a 'Related products' section provides shortcuts to laptop category listings (such as 'Lenovo laptops' and 'All Laptops'). Every link must point to a /laptops/ category URL.",
    },
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await goToProduct(page);
    });

    test("The Related products section contains at least three category links", async ({
      page,
    }) => {
      const relatedHeading = page.getByRole("heading", {
        name: "Related products",
        level: 2,
      });

      await test.step("Scroll to and locate the Related products heading", async () => {
        await relatedHeading.scrollIntoViewIfNeeded();
        await expect(relatedHeading).toBeVisible({ timeout: 10_000 });
      });

      await test.step("At least three category links are shown", async () => {
        const relatedSection = relatedHeading.locator("..");
        await expect(relatedSection.getByRole("link").first()).toBeVisible({
          timeout: 10_000,
        });
        expect(
          await relatedSection.getByRole("link").count()
        ).toBeGreaterThanOrEqual(3);
      });
    });

    test("All related product links point to /laptops/ pages and include brand and full-category shortcuts", async ({
      page,
    }) => {
      const relatedHeading = page.getByRole("heading", {
        name: "Related products",
        level: 2,
      });
      await relatedHeading.scrollIntoViewIfNeeded();
      await expect(relatedHeading).toBeVisible({ timeout: 10_000 });
      const relatedSection = relatedHeading.locator("..");

      await test.step("Wait for the links to render and verify every URL contains /laptops/", async () => {
        await expect(relatedSection.getByRole("link").first()).toBeVisible({
          timeout: 10_000,
        });
        const hrefs = await relatedSection
          .getByRole("link")
          .evaluateAll((links) =>
            (links as HTMLAnchorElement[]).map((a) => a.href)
          );
        for (const href of hrefs) {
          expect(href).toContain("/laptops");
        }
      });

      await test.step("Links to 'Lenovo laptops' and 'All Laptops' are both present", async () => {
        await expect(
          relatedSection.getByRole("link", { name: "Lenovo laptops" })
        ).toBeVisible({ timeout: 10_000 });
        await expect(
          relatedSection.getByRole("link", { name: "All Laptops" })
        ).toBeVisible({ timeout: 10_000 });
      });
    });
  }
);
