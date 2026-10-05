// Supabase 연결 검증 스크립트: node scripts/check-supabase.mjs
// .env의 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 사용.
// - content_blocks 테이블 읽기 (public read 정책 확인)
// - _ping 행 upsert+delete (쓰기 정책 확인)
// - 현재 저장된 콘텐츠 키 목록 출력
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const envPath = path.join(root, '.env')
const env = {}
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
    if (m) env[m[1]] = m[2]
  }
}

const url = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('MISS: .env에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 필요')
  process.exit(1)
}

const sb = createClient(url, key)
let fail = 0

// 1. 읽기
const read = await sb.from('content_blocks').select('key, updated_at')
if (read.error) {
  console.error('READ FAIL:', read.error.message)
  fail++
} else {
  console.log(`READ OK: ${read.data.length}행`)
  for (const r of read.data) console.log(`  - ${r.key} (${r.updated_at})`)
}

// 2. 쓰기 (ping 후 정리)
const ping = await sb.from('content_blocks').upsert({ key: '_ping', data: { t: Date.now() } }, { onConflict: 'key' })
if (ping.error) {
  console.error('WRITE FAIL:', ping.error.message)
  fail++
} else {
  console.log('WRITE OK')
  const del = await sb.from('content_blocks').delete().eq('key', '_ping')
  console.log(del.error ? `CLEANUP FAIL: ${del.error.message}` : 'CLEANUP OK')
}

process.exit(fail ? 1 : 0)
