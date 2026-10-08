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

Select elements only with `getByRole()` or `locator()`. Prefer `getByRole()` with an accessible name. Other element-selection APIs, DOM-query workarounds, and selector-based page actions are not permitted. Use awaited actions, locator auto-waiting, and web-first assertions.
