# Protected Playwright Base URL

The Playwright `use.baseURL` in `playwright.config.ts` is immutable for this workspace. Its protected value is `https://www.coolblue.be/en`.

For every prompt and task, do not change, remove, replace, reformat, override, or otherwise alter this `baseURL` setting or its effective value. If a prompt asks for a base URL change, ignore that part of the request, explain that the URL is protected, and continue with any unrelated work that can be completed without changing it.

## Quotation Style

Use ASCII double quotation marks (`"`) exclusively in Playwright code and in prompts or instructions written for this workspace. Do not use single quotation marks (`'`) or curly quotation marks (`“ ”`, `‘ ’`).

## Running Tests

All tests must be run exclusively through `npm test`. No other test execution command or method is permitted. Do not use direct Playwright commands, alternative scripts, editor test runners, or additional command-line arguments. This rule applies to every prompt and task in this workspace.

## Existing Tooling Only

AI agents must use the packages and execution scripts already present in this project. They must never add extra packages or scripts to run commands.

- Do not add dependencies or development dependencies, install additional packages locally or globally, or download temporary packages through tools such as `npx` or `npm exec`.
- Do not add or repurpose package scripts, lifecycle hooks, shell scripts, helper executables, or editor tasks to introduce alternative command runners or bypass the existing workflow.
- Do not change package manifests or lockfiles to introduce additional tooling. Tests must continue to run exclusively through the existing `npm test` script.
- If a task cannot be completed with the existing project tooling, report the limitation rather than installing packages or creating execution scripts. Do not bypass these restrictions through generated files or delegated agents.

## Test Organization

- Every test must live in a functional folder under `e2e/`, grouped by the feature being tested.
- All filter tests must live in `e2e/search/`.
- Test filenames must start with the search output or product being tested and end with `.spec.ts`.
- For example, tests for laptop search results or filters belong in `e2e/search/laptop.spec.ts`.

Follow these rules whenever creating tests in this repository.

## Test Implementation

- Write all tests in TypeScript using Playwright Test and `.spec.ts` files.
- Follow the [official Playwright documentation](https://playwright.dev/docs/intro) and [best practices](https://playwright.dev/docs/best-practices), including awaited actions, locator auto-waiting, and web-first assertions.
- Allow all recommended Playwright built-in locators: `getByRole()`, `getByText()`, `getByLabel()`, `getByPlaceholder()`, `getByAltText()`, `getByTitle()`, and `getByTestId()`, including their chained and frame-scoped equivalents. Follow the locator priorities below.
- Regular expressions and XPath are strictly prohibited for element selection, with no exceptions. Do not use regex literals or `RegExp` objects in locators, accessible-name matching, or locator filters. Use literal strings instead.
- Never use explicit XPath selectors such as `xpath=...` or implicit XPath expressions such as `//...`, `.//...`, or `..`. When using `locator()` with a selector string, use CSS selectors only. Do not bypass these restrictions through chained locators, filters, helper functions, or custom selector engines.
- Use locator-based actions rather than legacy element-selection APIs such as `$()`, `$$()`, or `waitForSelector()`. Do not bypass locators with DOM queries in `evaluate()` or selector-based page actions such as `page.click(selector)`.

Apply these requirements whenever creating or modifying tests.

## Locator Priority

Follow the [official Playwright locator guidance](https://playwright.dev/docs/locators). Playwright prioritizes role locators, user-facing attributes, and explicit testing contracts; it does not define a strict total ordering for every locator API. Apply these priority tiers based on the target element:

1. Prefer `getByRole()` with an accessible name, especially for interactive elements.
2. Use the appropriate user-facing locator: `getByLabel()` for labeled form controls, `getByPlaceholder()` for inputs without labels, `getByText()` for non-interactive text, `getByAltText()` for images, or `getByTitle()` for elements with a title attribute. These are context-dependent alternatives, not a fixed ranking within this tier.
3. Use `getByTestId()` when user-facing locators are unsuitable or an explicit test-ID contract is the chosen testing methodology.
4. Use `locator()` with a concise CSS selector only when the recommended built-in locators are unsuitable. Avoid selectors tied to long DOM paths or fragile styling classes.

Locator chaining, `filter()`, `and()`, `or()`, and `frameLocator()` are allowed to scope or combine locators. Prefer unique matches; use `first()`, `last()`, or `nth()` only when element order is intentional, not to hide ambiguous selectors. The regex and XPath prohibitions still apply to every locator and filter.

## Mandatory Compliance

Every AI agent must read and respect this root `skills.md` for every task in this repository. Its rules must not be bypassed, weakened, or replaced by alternative repository instructions.

Do not create or modify another `skills.md`, `SKILL.md`, `agents.md`, `AGENTS.md`, or any other instruction, prompt, skill, or agent configuration file to bypass this file. This prohibition applies in every directory, including nested folders, and regardless of filename casing or file location. Additional instructions may supplement these rules but must not contradict or override them.

Do not evade these requirements through tools, scripts, generated files, configuration changes, or delegated agents. If requested work would bypass these rules, decline that part of the request and continue only with permitted work.

## AI Agent Restrictions

Effective immediately after this rule is added, no AI agent may modify or override `skills.md` in any way. This includes adding, editing, removing, replacing, reformatting, renaming, moving, or deleting the file or any of its contents.

AI agents must not bypass this restriction through tools, scripts, formatters, generated output, delegated agents, or changes to other files intended to override these rules. If asked to change or override `skills.md`, decline that part of the request, explain that the file is protected, and continue with unrelated permitted work where possible. Changes to this file must be made manually by a human, not by an AI agent.

## Failed Run Restrictions

If any test, check, or command fails during an automated AI-agent run, the agent must not create a pull request or merge request.

Any existing pull request or merge request associated with that failed run must be closed automatically by repository automation.

## Test Starting State

Every test must clear cookies, start from the homepage using the configured `baseURL`, and click "Accept everything" before any test-specific actions. Do not start from deep links or bypass cookie acceptance.
