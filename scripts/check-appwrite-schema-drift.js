const { Client, Databases } = require("node-appwrite")
const { loadEnv, schema } = require("./setup-appwrite-schema")

function normalizeType(t) {
  const x = String(t || "").toLowerCase()
  if (x === "float") return "double"
  return x
}

function sameArray(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false
  return a.every((v, i) => String(v) === String(b[i]))
}

async function main() {
  const env = loadEnv()

  const endpoint = env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const apiKey = env.APPWRITE_API_KEY
  const databaseId = env.APPWRITE_DATABASE_ID

  if (!endpoint || !projectId || !apiKey || !databaseId) {
    throw new Error("Missing Appwrite config in env: endpoint/project/api key/database id")
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
  const databases = new Databases(client)

  const desiredCollections = schema(env)
  const drift = []

  for (const desired of desiredCollections) {
    const collectionDrift = {
      collectionId: desired.id,
      missingAttributes: [],
      mismatchedAttributes: [],
      extraAttributes: [],
      missingIndexes: [],
      mismatchedIndexes: [],
      extraIndexes: [],
      missingCollection: false,
    }

    try {
      await databases.getCollection(databaseId, desired.id)
    } catch {
      collectionDrift.missingCollection = true
      drift.push(collectionDrift)
      continue
    }

    const liveAttrsRes = await databases.listAttributes(databaseId, desired.id)
    const liveIdxRes = await databases.listIndexes(databaseId, desired.id)

    const liveAttrs = new Map((liveAttrsRes.attributes || []).map((a) => [a.key, a]))
    const liveIdx = new Map((liveIdxRes.indexes || []).map((i) => [i.key, i]))

    for (const attr of desired.attributes) {
      const live = liveAttrs.get(attr.key)
      if (!live) {
        collectionDrift.missingAttributes.push(attr.key)
        continue
      }

      const expectedType = normalizeType(attr.type)
      const actualType = normalizeType(live.type)
      const expectedRequired = Boolean(attr.required)
      const actualRequired = Boolean(live.required)
      const expectedArray = Boolean(attr.array)
      const actualArray = Boolean(live.array)

      if (
        expectedType !== actualType ||
        expectedRequired !== actualRequired ||
        expectedArray !== actualArray
      ) {
        collectionDrift.mismatchedAttributes.push({
          key: attr.key,
          expected: { type: expectedType, required: expectedRequired, array: expectedArray },
          actual: { type: actualType, required: actualRequired, array: actualArray },
        })
      }
    }

    const desiredAttrKeys = new Set(desired.attributes.map((a) => a.key))
    for (const key of liveAttrs.keys()) {
      if (!desiredAttrKeys.has(key)) collectionDrift.extraAttributes.push(key)
    }

    for (const idx of desired.indexes) {
      const live = liveIdx.get(idx.key)
      if (!live) {
        collectionDrift.missingIndexes.push(idx.key)
        continue
      }

      const expectedType = String(idx.type || "key").toLowerCase()
      const actualType = String(live.type || "key").toLowerCase()
      const expectedAttrs = idx.attributes || []
      const actualAttrs = live.attributes || []

      if (expectedType !== actualType || !sameArray(expectedAttrs, actualAttrs)) {
        collectionDrift.mismatchedIndexes.push({
          key: idx.key,
          expected: { type: expectedType, attributes: expectedAttrs },
          actual: { type: actualType, attributes: actualAttrs },
        })
      }
    }

    const desiredIdxKeys = new Set(desired.indexes.map((i) => i.key))
    for (const key of liveIdx.keys()) {
      if (!desiredIdxKeys.has(key)) collectionDrift.extraIndexes.push(key)
    }

    if (
      collectionDrift.missingCollection ||
      collectionDrift.missingAttributes.length ||
      collectionDrift.mismatchedAttributes.length ||
      collectionDrift.extraAttributes.length ||
      collectionDrift.missingIndexes.length ||
      collectionDrift.mismatchedIndexes.length ||
      collectionDrift.extraIndexes.length
    ) {
      drift.push(collectionDrift)
    }
  }

  if (drift.length === 0) {
    console.log("[check-appwrite-schema-drift] OK: No schema drift detected.")
    return
  }

  console.log("[check-appwrite-schema-drift] Drift detected:")
  for (const d of drift) {
    console.log(`- Collection: ${d.collectionId}`)
    if (d.missingCollection) {
      console.log("  * missing collection")
      continue
    }
    if (d.missingAttributes.length) console.log(`  * missing attributes: ${d.missingAttributes.join(", ")}`)
    if (d.mismatchedAttributes.length) {
      for (const m of d.mismatchedAttributes) {
        console.log(`  * mismatched attribute ${m.key}: expected=${JSON.stringify(m.expected)} actual=${JSON.stringify(m.actual)}`)
      }
    }
    if (d.extraAttributes.length) console.log(`  * extra attributes: ${d.extraAttributes.join(", ")}`)
    if (d.missingIndexes.length) console.log(`  * missing indexes: ${d.missingIndexes.join(", ")}`)
    if (d.mismatchedIndexes.length) {
      for (const m of d.mismatchedIndexes) {
        console.log(`  * mismatched index ${m.key}: expected=${JSON.stringify(m.expected)} actual=${JSON.stringify(m.actual)}`)
      }
    }
    if (d.extraIndexes.length) console.log(`  * extra indexes: ${d.extraIndexes.join(", ")}`)
  }

  process.exit(1)
}

main().catch((err) => {
  console.error("[check-appwrite-schema-drift] Failed:", err.message)
  process.exit(1)
})
