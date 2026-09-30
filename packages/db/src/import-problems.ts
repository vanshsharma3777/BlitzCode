import "dotenv/config"
import fs from "fs"
import readline from "readline"
import crypto from "crypto"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { problems, problemTests } from "./schema"

const client = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(client)

const FILES = [
  { path: "C:/codecontests/train.jsonl", split: "train" },
  { path: "C:/codecontests/valid.jsonl", split: "valid" },
  { path: "C:/codecontests/test.jsonl", split: "test" },
]

const hasNull = (s: any) => typeof s === "string" && s.includes("\u0000")
const strip = (s: string) => (s ?? "").replace(/\u0000/g, "")


const trim = (t: any, n = 20) => {
  if (!t?.input) return null
  const input: string[] = []
  const output: string[] = []
  for (let i = 0; i < t.input.length && input.length < n; i++) {
    if (hasNull(t.input[i]) || hasNull(t.output[i])) continue
    input.push(t.input[i])
    output.push(t.output[i])
  }
  return { input, output }
}


async function flush(pRows: any[], tRows: any[]) {
  if (!pRows.length) return
  await db.insert(problems).values(pRows)
  for (let i = 0; i < tRows.length; i += 20) {
    await db.insert(problemTests).values(tRows.slice(i, i + 20))
  }
}

async function importFile(path: string, split: string) {
  const rl = readline.createInterface({
    input: fs.createReadStream(path, "utf-8"),
    crlfDelay: Infinity,
  })

  let pRows: any[] = []
  let tRows: any[] = []
  let count = 0

  for await (const line of rl) {
    if (!line.trim()) continue
    const p = JSON.parse(line)
    const id = crypto.randomUUID()

    pRows.push({
      id,
      name: strip(p.name),
      description: strip(p.description),
      difficulty: p.difficulty,
      cfRating: p.cf_rating,
      cfTags: p.cf_tags,
      timeLimit: p.time_limit,
      memoryLimitBytes: Number(p.memory_limit_bytes),
      publicTests: trim(p.public_tests, 10),
      split,
    })
    tRows.push({
      problemId: id,
      privateTests: trim(p.private_tests),
      generatedTests: trim(p.generated_tests),
    })

    if (pRows.length >= 100) {
      await flush(pRows, tRows)
      count += pRows.length
      pRows = []
      tRows = []
      console.log(split, "imported", count)
    }
  }

  const remaining = pRows.length
  await flush(pRows, tRows)
  console.log(split, "done", count + remaining)
}

async function main() {
  for (const f of FILES) await importFile(f.path, f.split)
  await client.end()
}

main()