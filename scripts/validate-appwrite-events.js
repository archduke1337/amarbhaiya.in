const fs = require("fs")
const path = require("path")

const root = process.cwd()
const appwriteConfigPath = path.join(root, "appwrite", "appwrite.json")

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const env = {}
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue

    const key = trimmed.slice(0, idx).trim()
    const rawValue = trimmed.slice(idx + 1).trim()
    const value = rawValue.replace(/^['\"]|['\"]$/g, "")
    env[key] = value
  }

  return env
}

function extractCollectionIdFromEvent(eventName) {
  const marker = "collections."
  const idx = eventName.indexOf(marker)
  if (idx === -1) return null
  const rest = eventName.slice(idx + marker.length)
  const endIdx = rest.indexOf(".documents")
  if (endIdx === -1) return null
  return rest.slice(0, endIdx)
}

function main() {
  if (!fs.existsSync(appwriteConfigPath)) {
    console.error("[validate-appwrite-events] Missing appwrite/appwrite.json")
    process.exit(1)
  }

  const appwriteJson = JSON.parse(fs.readFileSync(appwriteConfigPath, "utf8"))
  const env = {
    ...readEnvFile(path.join(root, ".env")),
    ...readEnvFile(path.join(root, ".env.local")),
    ...process.env,
  }

  const expected = {
    "create-enrollment": env.APPWRITE_COLLECTION_PAYMENTS,
    "send-certificate": env.APPWRITE_COLLECTION_CERTIFICATES,
    "moderation-actions": env.APPWRITE_COLLECTION_MODERATION_ACTIONS,
  }

  let hasErrors = false

  for (const fn of appwriteJson.functions || []) {
    const expectedCollectionId = expected[fn.$id]
    if (!expectedCollectionId) continue

    const events = Array.isArray(fn.events) ? fn.events : []
    if (events.length === 0) {
      console.error(`[validate-appwrite-events] Function ${fn.$id} has no events configured.`)
      hasErrors = true
      continue
    }

    const actualCollections = events
      .map(extractCollectionIdFromEvent)
      .filter(Boolean)

    if (actualCollections.length === 0) {
      console.error(`[validate-appwrite-events] Function ${fn.$id} has no collection-based events.`)
      hasErrors = true
      continue
    }

    const matches = actualCollections.includes(expectedCollectionId)
    if (!matches) {
      console.error(
        `[validate-appwrite-events] Mismatch for ${fn.$id}: expected collection '${expectedCollectionId}', found [${actualCollections.join(", ")}].`
      )
      hasErrors = true
    }
  }

  if (hasErrors) {
    process.exit(1)
  }

  console.log("[validate-appwrite-events] OK: function events are aligned with configured collection IDs.")
}

main()
