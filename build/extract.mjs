import { ClassicLevel } from "classic-level"
import * as fs from "node:fs/promises"
import { existsSync, createWriteStream } from "node:fs"
import * as path from "node:path"

const dir = path.resolve("./packs/macros")
const outDir = path.join("./build/macros")

// if (existsSync(outDir)) await fs.rm(outDir, { recursive: true })
if (!existsSync(outDir)) await fs.mkdir(outDir)

const db = new ClassicLevel(dir)
// if (db.status !== "open") throw new Error("DB is not open! Maybe locked?")

for await (const [key, value] of db.iterator()) {
  const doc = JSON.parse(value)

  const stream = createWriteStream(path.join(outDir, `${doc.name}.js`))

  const subset = Object.fromEntries(
    ["name", "img", "_id"].map((key) => [key, doc[key]])
  )
  stream.write(`/* ${JSON.stringify(subset)} */`)
  stream.write("\n")
  stream.write(doc.command)

  stream.close()
}

db.close()
