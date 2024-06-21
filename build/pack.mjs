import { ClassicLevel } from "classic-level"
import * as fs from "node:fs/promises"
import { existsSync, createWriteStream } from "node:fs"
import * as path from "node:path"

const DOCUMENT_DEFAULT = {
  type: "script",
  scope: "global",
  author: "xpf2eanimationsx",
}

const PACK = "macros"

const dir = path.resolve(`./packs/${PACK}`)
const inputDir = path.resolve(`./build/macros`)

if (!existsSync(dir)) await fs.mkdir(dir)

for (const file of await fs.readdir(dir)) {
  const fp = path.join(dir, file)
  if ((await fs.lstat(fp)).isFile()) await fs.rm(fp)
}

const db = new ClassicLevel(dir, { keyEncoding: "utf8", valueEncoding: "json" })
// if (db.status !== "open") throw new Error("DB is not open! Maybe locked?")
const batch = db.batch()

for (const file of await fs.readdir(inputDir)) {
  const content = await fs.readFile(path.join(inputDir, file), {
    encoding: "utf-8",
  })

  const re = /\/\*\s+(.+?)\s+\*\/\n(.+)/gms

  const match = re.exec(content)
  if (!match) throw new Error(`Content of ${file} doesn't match regex`)
  const [_, meta, macro] = match

  const doc = { ...DOCUMENT_DEFAULT, ...JSON.parse(meta) }
  doc.command = macro

  batch.put(`!macros!${doc._id}`, doc)
}

await batch.write()
await compactClassicLevel(db)
await db.close()

async function compactClassicLevel(db) {
  const forwardIterator = db.keys({ limit: 1, fillCache: false })
  const firstKey = await forwardIterator.next()
  await forwardIterator.close()

  const backwardIterator = db.keys({
    limit: 1,
    reverse: true,
    fillCache: false,
  })
  const lastKey = await backwardIterator.next()
  await backwardIterator.close()

  if (firstKey && lastKey)
    return db.compactRange(firstKey, lastKey, { keyEncoding: "utf8" })
}
