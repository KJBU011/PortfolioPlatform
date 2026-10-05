// 초기 데이터 적재: node scripts/seed-supabase.mjs [--force]
// mock 기본값을 content_blocks에 upsert. 기본적으로 빈 테이블일 때만 실행.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildSync } from 'esbuild'
import { createClient } from '@supabase/supabase-js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const force = process.argv.includes('--force')

const env = {}
for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
  if (m) env[m[1]] = m[2]
}
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

const { data: existing, error: readErr } = await sb.from('content_blocks').select('key')
if (readErr) {
  console.error('READ FAIL:', readErr.message)
  process.exit(1)
}
const realRows = (existing ?? []).filter((r) => r.key !== '_ping')
if (realRows.length > 0 && !force) {
  console.log(`SKIP: 이미 ${realRows.length}행 존재 (--force로 덮어쓰기 가능)`)
  process.exit(0)
}

// TS 데이터 모듈을 node용으로 번들
const outFile = path.join(root, 'scripts', '.seed-bundle.mjs')
buildSync({
  entryPoints: [path.join(root, 'scripts', 'seed-entry.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: outFile,
  alias: { '@': path.join(root, 'src') },
  define: { 'import.meta.env': '{}' },
  logLevel: 'error',
})
const { snapshot } = await import(pathToFileURL(outFile).href)
fs.unlinkSync(outFile)

const rows = Object.entries(snapshot).map(([key, data]) => ({ key, data }))
const { error: upErr } = await sb.from('content_blocks').upsert(rows, { onConflict: 'key' })
if (upErr) {
  console.error('SEED FAIL:', upErr.message)
  process.exit(1)
}
console.log(`SEED OK: ${rows.length}행 upsert (${rows.map((r) => r.key).join(', ')})`)
