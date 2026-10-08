import { test, expect, type Page } from "@playwright/test";

/**
 * Dismiss the cookie consent dialog if it is visible and wait until the
 * blocking <dialog open> element is gone from the DOM.
 */
async function acceptCookies(page: Page) {
  const cookieBtn = page.getByRole("button", { name: "Accept everything" });
  try {
    await cookieBtn.waitFor({ state: "visible", timeout: 5000 });
    await cookieBtn.click();
    await page.waitForFunction(() => !document.querySelector("dialog[open]"), {
      timeout: 10_000,
    });
  } catch {
    // Banner absent or already dismissed — continue.
  }
}

// ─── Test data ────────────────────────────────────────────────────────────────

/** All 11 top-navigation category buttons, in order. */
const ALL_NAV_BUTTONS = [
  "Computers & tablets",
  "Telephony",
  "Image & sound",
  "Gaming",
  "Business and working from home",
  "Household & living",
  "Kitchen",
  "Personal care & Leisure",
  "Photo & video",
  "Ecocheques",
  "Deals & brands",
];

/**
 * Representative top-level flyout links — verified by browsing the live site.
 * path  → URL suffix appended to process.env.BASE_URL (which already contains /en)
 * h1    → substring expected in the landing page <h1>
 */
const FLYOUT_LINKS = [
  { button: "Computers & tablets",  link: "Laptops",                  path: "/laptops",                   h1: "Laptops" },
  { button: "Telephony",            link: "Mobile phones",            path: "/mobile-phones",             h1: "Mobile phones" },
  { button: "Image & sound",        link: "Televisions & projectors", path: "/televisions-projectors",    h1: "Televisions" },
];

// ─── Case 1: every nav button opens its flyout ───────────────────────────────

test.describe(
  "Navigation buttons open the correct flyout panel",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "Each of the 11 category buttons in the top navigation bar toggles its flyout panel open, confirmed by aria-expanded becoming true.",
    },
  },
  () => {
    test("every nav button expands its flyout when clicked", async ({ page, baseURL }) => {
      test.setTimeout(90_000);
      await page.goto(baseURL!, { waitUntil: "load" });
      await acceptCookies(page);

      for (const name of ALL_NAV_BUTTONS) {
        await test.step(`"${name}" opens its flyout`, async () => {
          const btn = page.getByRole("button", { name, exact: true });
          await btn.click();
          await expect(btn).toHaveAttribute("aria-expanded", "true");
        });
      }
    });
  }
);

// ─── Case 2: flyout links navigate to the correct pages ──────────────────────

test.describe(
  "Navigation flyout links lead to the correct category pages",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "Clicking a top-level category link inside a nav flyout takes the visitor to the correct category page, confirmed by the URL and page heading.",
    },
  },
  () => {
    test("flyout category links navigate to the correct pages", async ({ page, baseURL }) => {
      test.setTimeout(120_000);

      for (const { button, link, path, h1 } of FLYOUT_LINKS) {
        await test.step(
          `"${button}" → "${link}" lands on ${path}`,
          async () => {
            await page.goto(baseURL!, { waitUntil: "load" });
            // The cookie banner may reappear on every fresh home-page load.
            await acceptCookies(page);
            const btn = page.getByRole("button", { name: button, exact: true });
            await btn.click();
            await expect(btn).toHaveAttribute("aria-expanded", "true");
            await page.getByRole("link", { name: link, exact: true }).first().click();
            // baseURL ends with /en; paths start with / so there is no double segment.
            await expect(page).toHaveURL(`${baseURL}${path}`);
            await expect(page.locator("h1")).toContainText(h1);
          }
        );
      }
    });
  }
);
