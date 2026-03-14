# DoorDash group order automation scaffold

This is a small Playwright-based helper for the “use the right DashPass account every time” problem.

## What it does

- launches Chromium with a persisted profile in `.auth/doordash-profile`
- lets you log in once and reuse that session later
- opens a specific DoorDash store URL
- tries to find a **group order** entry point
- supports **assisted** and **dry-run** modes so fragile checkout steps can stay manual
- saves screenshots to `.artifacts/` at each checkpoint

## Quick start

```bash
npm install
npx playwright install chromium
cp automation/doordash-group-order.config.example.json automation/doordash-group-order.config.json
```

### First run: sign in and save the session

```bash
npm run doordash:group-order -- --login-only --pause-after-launch
```

That opens Chromium with a persistent profile. Log into the correct DoorDash account, then press Enter in the terminal.

### Normal run

```bash
npm run doordash:group-order -- --config automation/doordash-group-order.config.json
```

### Dry run

```bash
npm run doordash:group-order -- --config automation/doordash-group-order.config.json --dry-run
```

## Config

Example:

```json
{
  "storeUrl": "https://www.doordash.com/store/example-store-id/",
  "headless": false,
  "groupOrder": {
    "enabled": true,
    "mode": "assisted"
  },
  "addressLabel": "Office",
  "participants": ["joel@example.com"],
  "items": [
    {
      "name": "Spicy Chicken Sandwich",
      "quantity": 1,
      "mode": "manual-confirm"
    }
  ]
}
```

## Notes

- DoorDash changes UI details often, so this script intentionally uses an **assisted** workflow.
- Credentials are **not** stored in the repo; only the local Chromium profile is reused.
- Item customization is intentionally left manual unless you extend the selectors for a specific store/menu.
