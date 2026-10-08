import { test, expect } from "@playwright/test";

const PRODUCT_URL =
  "https://www.coolblue.be/en/product/966206/lenovo-thinkpad-e14-g7-ial-21sx0076mb-azerty.html";

test.describe(
  "Lenovo ThinkPad E14 G7 IAL product page — content and specifications",
  {
    tag: "@case",
    annotation: {
      type: "description",
      description:
        "Verifies that the Lenovo ThinkPad E14 G7 IAL product page shows the correct title, price, key specs summary, and full specification values so a shopper sees accurate information.",
    },
  },
  () => {
    test.describe.configure({ mode: "serial" });

    test.beforeEach(async ({ page }) => {
      await page.goto(PRODUCT_URL, { waitUntil: "domcontentloaded" });
      const cookieBtn = page.getByRole("button", { name: "Accept everything" });
      if (await cookieBtn.isVisible()) {
        await cookieBtn.click();
      }
    });

    // ── Title & Brand ─────────────────────────────────────────────────────────
    test("displays the correct product title and brand", async ({ page }) => {
      await test.step("H1 heading matches the product name", async () => {
        await expect(
          page.getByRole("heading", {
            name: "Lenovo ThinkPad E14 G7 IAL - 21SX0076MB AZERTY",
            level: 1,
          })
        ).toBeVisible();
      });

      await test.step("Lenovo brand logo is present on the page", async () => {
        await expect(
          page.getByRole("img", { name: "Lenovo" }).first()
        ).toBeVisible();
      });
    });

    // ── Price ─────────────────────────────────────────────────────────────────
    test("shows the correct price of 1.449,-", async ({ page }) => {
      await test.step("Price shows 1.449,- in the purchase block", async () => {
        await expect(page.locator("text=1.449,-").first()).toBeVisible();
      });
    });

    // ── Key Specs summary ─────────────────────────────────────────────────────
    test("shows the correct key specs summary", async ({ page }) => {
      // The Key specs block exists in a mobile-hidden and desktop-visible variant.
      // Use :visible to target only the displayed one.
      const keySpecsContainer = page
        .locator("h3:visible", { hasText: "Key specs" })
        .locator("..");

      await test.step("Screen size key spec is 14 inches", async () => {
        await expect(keySpecsContainer.locator("text=14 inches")).toBeVisible();
      });

      await test.step("Processor key spec is Intel Core Ultra 7", async () => {
        await expect(
          keySpecsContainer.locator("text=Intel Core Ultra 7")
        ).toBeVisible();
      });

      await test.step("RAM key spec is 32 GB", async () => {
        await expect(keySpecsContainer.locator("text=32 GB")).toBeVisible();
      });

      await test.step("Storage key spec is 1 TB", async () => {
        await expect(keySpecsContainer.locator("text=1 TB")).toBeVisible();
      });

      await test.step("Video card key spec is Intel Arc Graphics", async () => {
        await expect(
          keySpecsContainer.locator("text=Intel Arc Graphics")
        ).toBeVisible();
      });
    });

    // ── Box contents ──────────────────────────────────────────────────────────
    test("shows the correct box contents", async ({ page }) => {
      const boxSection = page
        .locator("h3:visible", { hasText: "This is what you get" })
        .locator("xpath=following-sibling::*[1]");

      await test.step("Box includes a Manual", async () => {
        await expect(boxSection.getByText("Manual")).toBeVisible();
      });

      await test.step("Box includes a Charger", async () => {
        await expect(boxSection.getByText("Charger")).toBeVisible();
      });
    });

    // ── Specs: Product table ──────────────────────────────────────────────────
    test("specifications — Product table is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Product number is 966206", async () => {
        await expect(
          specs.getByRole("row", { name: "Product number 966206" })
        ).toBeVisible();
      });

      await test.step("Manufacturer code is 21SX0076MB", async () => {
        await expect(
          specs.getByRole("row", { name: "Manufacturer code 21SX0076MB" })
        ).toBeVisible();
      });

      await test.step("Brand is Lenovo", async () => {
        await expect(
          specs.getByRole("row", { name: "Brand Lenovo" })
        ).toBeVisible();
      });

      await test.step("Warranty is 3 years", async () => {
        await expect(
          specs.getByRole("row", { name: "Warranty 3 years" })
        ).toBeVisible();
      });
    });

    // ── Specs: Screen table ───────────────────────────────────────────────────
    test("specifications — Screen table is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Screen size is 14 inches", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Screen size Screen size 14 inches",
          })
        ).toBeVisible();
      });

      await test.step("Panel type is IPS panel", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Panel type Panel type IPS panel",
          })
        ).toBeVisible();
      });

      await test.step("Resolution width is 1920 pixels", async () => {
        await expect(
          specs.getByRole("row", { name: "Resolution width 1920 pixels" })
        ).toBeVisible();
      });

      await test.step("Resolution height is 1200 pixels", async () => {
        await expect(
          specs.getByRole("row", { name: "Resolution height 1200 pixels" })
        ).toBeVisible();
      });

      await test.step("Refresh rate is 60 Hz", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Refresh rate Refresh rate 60 Hz",
          })
        ).toBeVisible();
      });

      await test.step("Aspect ratio is 16:10", async () => {
        await expect(
          specs.getByRole("row", { name: "Aspect ratio 16:10" })
        ).toBeVisible();
      });

      await test.step("Sharpness is WUXGA", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Sharpness Sharpness WUXGA",
          })
        ).toBeVisible();
      });

      await test.step("Brightness is 300 cd/m2", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Brightness Brightness 300 cd/m2",
          })
        ).toBeVisible();
      });

      await test.step("Screen reflection is Anti-glare", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Screen reflection Screen reflection Anti-glare",
          })
        ).toBeVisible();
      });

      await test.step("Touchscreen is No", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Touchscreen Touchscreen No",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Processor table ────────────────────────────────────────────────
    test("specifications — Processor table is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Processor is Intel Core Ultra 7", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Processor Processor Intel Core Ultra 7",
          })
        ).toBeVisible();
      });

      await test.step("Processor number is 255H", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Processor number Processor number 255H",
          })
        ).toBeVisible();
      });

      await test.step("Processor generation is Ultra Series 2", async () => {
        await expect(
          specs.getByRole("row", {
            name: "Processor generation Ultra Series 2",
          })
        ).toBeVisible();
      });

      await test.step("Processor cores is Hexadeca-Core (16)", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Processor cores Processor cores Hexadeca-Core (16)",
          })
        ).toBeVisible();
      });

      await test.step("Clock speed is 1,5 GHz", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Clock speed Clock speed 1,5 GHz",
          })
        ).toBeVisible();
      });

      await test.step("Turbo speed is 5,1 GHz", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Turbo speed Turbo speed 5,1 GHz",
          })
        ).toBeVisible();
      });

      await test.step("Cache memory is 24 MB", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Cache memory Cache memory 24 MB",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: RAM table ──────────────────────────────────────────────────────
    test("specifications — RAM table is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Internal RAM is 32 GB", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Internal RAM Internal RAM 32 GB",
          })
        ).toBeVisible();
      });

      await test.step("Memory composition is 2x 16GB", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Memory composition Memory composition 2x 16GB",
          })
        ).toBeVisible();
      });

      await test.step("RAM type is DDR5", async () => {
        await expect(
          specs.getByRole("row", { name: "RAM type (DDR type) DDR5" })
        ).toBeVisible();
      });

      await test.step("Memory speed is 5600 MHz", async () => {
        await expect(
          specs.getByRole("row", { name: "Memory speed 5600 MHz" })
        ).toBeVisible();
      });

      await test.step("Maximum internal memory is 64 GB", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Maximum internal memory Maximum internal memory 64 GB",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Storage table ──────────────────────────────────────────────────
    test("specifications — Storage table is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Total storage capacity is 1 TB", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Total storage capacity Total storage capacity 1 TB",
          })
        ).toBeVisible();
      });

      await test.step("Storage type is SSD", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Storage type Storage type SSD",
          })
        ).toBeVisible();
      });

      await test.step("Hard drive type is NVMe", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Hard drive type Hard drive type NVMe",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Video card table ───────────────────────────────────────────────
    test("specifications — Video card table is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Video card is Intel Arc Graphics", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Video card Video card Intel Arc Graphics",
          })
        ).toBeVisible();
      });

      await test.step("Video card brand is Intel", async () => {
        await expect(
          specs.getByRole("row", { name: "Video card brand Intel" })
        ).toBeVisible();
      });

      await test.step("Type of video card is Hybrid", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Type of video card Type of video card Hybrid",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Operating system ───────────────────────────────────────────────
    test("specifications — Operating system is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Operating system is Windows", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Operating system Operating system Windows",
          })
        ).toBeVisible();
      });

      await test.step("Windows OS version is Windows 11 Pro", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Windows OS version Windows OS version Windows 11 Pro",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Physical properties ────────────────────────────────────────────
    test("specifications — Physical properties are correct", async ({
      page,
    }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Color is Black", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Color Color Black",
          })
        ).toBeVisible();
      });

      await test.step("Material is Metal", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Material Material Metal",
          })
        ).toBeVisible();
      });

      await test.step("Metal type is Aluminum", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Metal type Metal type Aluminum",
          })
        ).toBeVisible();
      });

      await test.step("Height is 1,9 cm", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Height Height 1,9 cm",
          })
        ).toBeVisible();
      });

      await test.step("Width is 31,3 cm", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Width Width 31,3 cm",
          })
        ).toBeVisible();
      });

      await test.step("Depth is 22 cm", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Depth Depth 22 cm",
          })
        ).toBeVisible();
      });

      await test.step("Weight is 1,34 kg", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Weight Weight 1,34 kg",
          })
        ).toBeVisible();
      });

      await test.step("Passed military test is Yes", async () => {
        await expect(
          specs.getByRole("row", { name: "Passed military test Yes" })
        ).toBeVisible();
      });
    });

    // ── Specs: Wireless connections ───────────────────────────────────────────
    test("specifications — Wireless connections are correct", async ({
      page,
    }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Bluetooth version is 5.3", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Bluetooth version Bluetooth version 5.3",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Wired connections ──────────────────────────────────────────────
    test("specifications — Wired connections are correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Number of USB ports is 4", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Number of USB ports Number of USB ports 4",
          })
        ).toBeVisible();
      });

      await test.step("HDMI connector is present", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about HDMI connector HDMI connector Yes",
          })
        ).toBeVisible();
      });

      await test.step("Female HDMI Type A port version is 2.1", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Female HDMI Type A port version Female HDMI Type A port version 2.1",
          })
        ).toBeVisible();
      });

      await test.step("Thunderbolt connector is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Thunderbolt connector Thunderbolt connector Yes",
          })
        ).toBeVisible();
      });

      await test.step("Headphone jack is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Headphone jack Headphone jack Yes",
          })
        ).toBeVisible();
      });

      await test.step("Network connector is Yes", async () => {
        await expect(
          specs.getByRole("row", { name: "Network connector Yes" })
        ).toBeVisible();
      });
    });

    // ── Specs: Keyboard ───────────────────────────────────────────────────────
    test("specifications — Keyboard is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Keyboard layout is AZERTY", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Keyboard layout Keyboard layout AZERTY",
          })
        ).toBeVisible();
      });

      await test.step("Backlit keyboard is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Backlit keyboard Backlit keyboard Yes",
          })
        ).toBeVisible();
      });

      await test.step("Spill-resistant is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Spill-resistant Spill-resistant Yes",
          })
        ).toBeVisible();
      });
    });

    // ── Specs: Battery ────────────────────────────────────────────────────────
    test("specifications — Battery is correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("Battery capacity is 64 Wh", async () => {
        await expect(
          specs.getByRole("row", { name: "Battery capacity laptop 64 Wh" })
        ).toBeVisible();
      });

      await test.step("Battery technology is Lithium-ion", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Battery technology Battery technology Lithium-ion",
          })
        ).toBeVisible();
      });

      await test.step("Charger included is Yes", async () => {
        await expect(
          specs.getByRole("row", { name: "Charger included Yes" })
        ).toBeVisible();
      });

      await test.step("Laptop wattage is 65 W", async () => {
        await expect(
          specs.getByRole("row", { name: "Laptop wattage 65 W" })
        ).toBeVisible();
      });
    });

    // ── Specs: Security ───────────────────────────────────────────────────────
    test("specifications — Security features are correct", async ({ page }) => {
      const specs = page.getByRole("region", { name: "Specifications" });

      await test.step("TPM is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about TPM (Trusted platform module) TPM (Trusted platform module) Yes",
          })
        ).toBeVisible();
      });

      await test.step("TPM type is Discrete TPM chip", async () => {
        await expect(
          specs.getByRole("row", { name: "TPM type Discrete TPM chip" })
        ).toBeVisible();
      });

      await test.step("Kensington lock is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Kensington lock Kensington lock Yes",
          })
        ).toBeVisible();
      });

      await test.step("Windows Hello is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Windows Hello Windows Hello Yes",
          })
        ).toBeVisible();
      });

      await test.step("Infrared camera is Yes", async () => {
        await expect(
          specs.getByRole("row", {
            name: "More information about Infrared camera Infrared camera Yes",
          })
        ).toBeVisible();
      });
    });
  }
);
