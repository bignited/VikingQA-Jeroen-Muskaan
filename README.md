# VikingQA

## Running Tests

All tests must be run exclusively through:

```sh
npm test
```

No other test execution command or method is permitted. Do not use direct Playwright commands, alternative scripts, editor test runners, or additional command-line arguments.

## Test Organization

Every test must live in a functional folder under `e2e/`, grouped by the feature being tested. All filter tests belong in `e2e/search/`.

Test filenames must start with the search output or product being tested and end with `.spec.ts`. For example, laptop search result and filter tests belong in `e2e/search/laptop.spec.ts`.

See [skills.md](skills.md) for the repository rules.

## Test Implementation

All tests must be written in TypeScript using Playwright Test and `.spec.ts` files. Follow the [official Playwright documentation](https://playwright.dev/docs/intro) and [best practices](https://playwright.dev/docs/best-practices).

Allow all recommended Playwright built-in locators: `getByRole()`, `getByText()`, `getByLabel()`, `getByPlaceholder()`, `getByAltText()`, `getByTitle()`, and `getByTestId()`. Follow the [official locator guidance](https://playwright.dev/docs/locators): prioritize roles, then appropriate user-facing attributes, use test IDs for explicit testing contracts, and use CSS through `locator()` only as a fallback. Playwright does not define a strict ranking among all user-facing locator APIs.

Locator chaining, filtering, combining, and frame scoping are allowed. Regex and XPath remain prohibited. Legacy element-selection APIs, DOM-query workarounds, and selector-based page actions are not permitted. Use awaited actions, locator auto-waiting, and web-first assertions. See the locator priorities in [skills.md](skills.md).
