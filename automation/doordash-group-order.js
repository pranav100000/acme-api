#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline/promises')
const { stdin, stdout } = require('process')
const { chromium } = require('playwright')

const projectRoot = path.resolve(__dirname, '..')
const defaultConfigPath = path.join(__dirname, 'doordash-group-order.config.json')
const authDir = path.join(projectRoot, '.auth')
const browserProfileDir = path.join(authDir, 'doordash-profile')
const artifactsDir = path.join(projectRoot, '.artifacts')

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printHelp()
    return
  }

  ensureDir(authDir)
  ensureDir(artifactsDir)

  const config = loadConfig(args.configPath || defaultConfigPath)
  const settings = {
    headless: args.headless ?? config.headless ?? false,
    loginOnly: args.loginOnly ?? config.loginOnly ?? false,
    pauseAfterLaunch: args.pauseAfterLaunch ?? config.pauseAfterLaunch ?? false,
    dryRun: args.dryRun ?? false,
    storeUrl: args.storeUrl || config.storeUrl || 'https://www.doordash.com',
    addressLabel: args.addressLabel || config.addressLabel || null,
    groupOrder: {
      enabled: config.groupOrder?.enabled ?? true,
      mode: config.groupOrder?.mode || 'assisted'
    },
    participants: config.participants || [],
    items: config.items || []
  }

  console.log('Launching browser profile:', browserProfileDir)
  const context = await chromium.launchPersistentContext(browserProfileDir, {
    headless: settings.headless,
    viewport: { width: 1440, height: 1024 }
  })

  const page = context.pages()[0] || await context.newPage()

  try {
    await page.goto(settings.storeUrl, { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
    await saveCheckpoint(page, 'loaded')

    if (settings.pauseAfterLaunch) {
      await prompt('Browser is ready. Complete any manual steps, then press Enter to continue.')
    }

    if (settings.loginOnly) {
      console.log('Login-only mode complete. Your session is saved in .auth/doordash-profile.')
      return
    }

    await maybeSelectAddress(page, settings)

    if (settings.groupOrder.enabled) {
      await createOrResumeGroupOrder(page, settings)
    }

    if (settings.items.length > 0) {
      await handleItems(page, settings)
    }

    const summary = await collectSummary(page, settings)
    console.log('\nRun summary')
    console.log(JSON.stringify(summary, null, 2))
    console.log('\nDone.')
  } finally {
    if (!settings.headless) {
      console.log('\nKeeping browser open for 10 seconds so you can inspect the page...')
      await page.waitForTimeout(10000)
    }
    await context.close()
  }
}

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]

    switch (arg) {
      case '--help':
      case '-h':
        args.help = true
        break
      case '--config':
        args.configPath = resolveFromCwd(next)
        index += 1
        break
      case '--store-url':
        args.storeUrl = next
        index += 1
        break
      case '--address-label':
        args.addressLabel = next
        index += 1
        break
      case '--headless':
        args.headless = true
        break
      case '--login-only':
        args.loginOnly = true
        break
      case '--pause-after-launch':
        args.pauseAfterLaunch = true
        break
      case '--dry-run':
        args.dryRun = true
        break
      default:
        throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return args
}

function printHelp() {
  console.log(`
DoorDash group order automation scaffold

Usage:
  npm run doordash:group-order -- [options]

Options:
  --config <path>           Path to a JSON config file
  --store-url <url>         Override the store URL
  --address-label <label>   Preferred saved address label
  --login-only              Open DoorDash and save your signed-in session
  --pause-after-launch      Pause after loading the page for manual actions
  --dry-run                 Do not click order-changing actions automatically
  --headless                Run Chromium in headless mode
  --help, -h                Show this message
`)
}

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    console.log(`Config not found at ${configPath}. Falling back to CLI defaults.`)
    return {}
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function resolveFromCwd(targetPath) {
  return path.isAbsolute(targetPath) ? targetPath : path.join(process.cwd(), targetPath)
}

async function maybeSelectAddress(page, settings) {
  if (!settings.addressLabel) {
    return
  }

  console.log(`Trying to select saved address: ${settings.addressLabel}`)

  const addressCandidates = [
    page.getByRole('button', { name: new RegExp(settings.addressLabel, 'i') }),
    page.getByText(new RegExp(`^${escapeRegex(settings.addressLabel)}$`, 'i')).first()
  ]

  for (const candidate of addressCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click().catch(() => {})
      await page.waitForTimeout(1000)
      console.log('Address selection clicked.')
      return
    }
  }

  console.log('Saved address not found automatically; continuing.')
}

async function createOrResumeGroupOrder(page, settings) {
  console.log(`Group order mode: ${settings.groupOrder.mode}`)

  const selectors = [
    { label: 'Start group order', locator: page.getByRole('button', { name: /start group order/i }) },
    { label: 'Group order', locator: page.getByRole('button', { name: /^group order$/i }) },
    { label: 'Create group order', locator: page.getByRole('button', { name: /create group order/i }) },
    { label: 'Order together', locator: page.getByText(/order together/i).first() }
  ]

  for (const { label, locator } of selectors) {
    if (await locator.isVisible().catch(() => false)) {
      if (settings.dryRun) {
        console.log(`[dry-run] Would click "${label}"`)
      } else {
        console.log(`Clicking "${label}"`)
        await locator.click().catch(() => {})
        await page.waitForTimeout(1500)
      }
      await saveCheckpoint(page, 'group-order')
      return
    }
  }

  if (settings.groupOrder.mode === 'assisted') {
    console.log('Could not identify a group order CTA automatically.')
    await prompt('Please start or resume the group order manually, then press Enter.')
    await saveCheckpoint(page, 'group-order-assisted')
    return
  }

  throw new Error('Unable to find a group-order entry point.')
}

async function handleItems(page, settings) {
  console.log(`Processing ${settings.items.length} requested item(s).`)

  for (const item of settings.items) {
    console.log(`Looking for item: ${item.name}`)

    const locator = page.getByText(new RegExp(escapeRegex(item.name), 'i')).first()
    const visible = await locator.isVisible().catch(() => false)

    if (!visible) {
      console.log(`Item "${item.name}" was not found on the current page.`)
      continue
    }

    if (settings.dryRun || item.mode === 'manual-confirm') {
      console.log(`[assist] Found "${item.name}" but leaving it for manual confirmation.`)
      await locator.scrollIntoViewIfNeeded().catch(() => {})
      await saveCheckpoint(page, slugify(item.name))
      continue
    }

    await locator.click().catch(() => {})
    await page.waitForTimeout(1000)
    console.log(`Opened "${item.name}". Quantity requested: ${item.quantity || 1}`)
    await saveCheckpoint(page, slugify(item.name))
  }
}

async function collectSummary(page, settings) {
  const url = page.url()
  const title = await page.title()

  return {
    title,
    url,
    dryRun: settings.dryRun,
    loginOnly: settings.loginOnly,
    participantsRequested: settings.participants,
    itemsRequested: settings.items.map(item => ({
      name: item.name,
      quantity: item.quantity || 1,
      mode: item.mode || 'manual-confirm'
    }))
  }
}

async function saveCheckpoint(page, name) {
  const fileName = `${new Date().toISOString().replace(/[:.]/g, '-')}-${name}.png`
  const filePath = path.join(artifactsDir, fileName)
  await page.screenshot({ path: filePath, fullPage: true }).catch(() => {})
  console.log(`Saved checkpoint: ${path.relative(projectRoot, filePath)}`)
}

async function prompt(message) {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  try {
    await rl.question(`${message}\n`)
  } finally {
    rl.close()
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

main().catch((error) => {
  console.error('\nAutomation failed:')
  console.error(error.stack || error.message)
  process.exitCode = 1
})
