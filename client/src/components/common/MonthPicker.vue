<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string // 'YYYY-MM' | ''
  disabled?: boolean
  placeholder?: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const viewYear = ref(new Date().getFullYear())
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth() + 1

function parseYm(ym: string) {
  const m = ym.match(/^(\d{4})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  if (y < 1900 || y > 2100 || mo < 1 || mo > 12) return null
  return { y, m: mo }
}

const selected = computed(() => parseYm(props.modelValue))
const display = computed(() => {
  const s = selected.value
  return s ? `${s.y}.${String(s.m).padStart(2, '0')}` : ''
})

function toggle(force?: boolean) {
  if (props.disabled) return
  const next = force ?? !open.value
  if (next) viewYear.value = selected.value?.y ?? thisYear
  open.value = next
}

function stepYear(d: number) {
  viewYear.value = Math.min(2100, Math.max(1900, viewYear.value + d))
}

function pick(month: number) {
  emit('update:modelValue', `${viewYear.value}-${String(month).padStart(2, '0')}`)
  open.value = false
}

function clear() {
  emit('update:modelValue', '')
  open.value = false
}

function isSelected(month: number) {
  const s = selected.value
  return !!s && s.y === viewYear.value && s.m === month
}

function onDocClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      :disabled="disabled"
      :class="[
        'inline-flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-[13.5px] outline-none transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : open
            ? 'border-[#2563EB] bg-white'
            : 'hover:border-[#93C5FD] hover:bg-white',
      ]"
      @click="toggle()"
    >
      <CalendarDays :size="15" class="shrink-0 text-[#2563EB]" />
      <span :class="display ? 'font-mono font-semibold text-slate-800' : 'text-slate-400'">
        {{ display || placeholder || '연·월 선택' }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute left-0 top-[calc(100%+8px)] z-50 w-[264px] rounded-[14px] border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
    >
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="rounded-[8px] p-1.5 text-slate-500 transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
          aria-label="이전 연도"
          @click="stepYear(-1)"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="font-mono text-[14px] font-bold text-slate-900">{{ viewYear }}년</span>
        <button
          type="button"
          class="rounded-[8px] p-1.5 text-slate-500 transition-colors hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
          aria-label="다음 연도"
          @click="stepYear(1)"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
      <div class="mt-3 grid grid-cols-3 gap-1.5">
        <button
          v-for="mo in 12"
          :key="mo"
          type="button"
          :class="[
            'rounded-[10px] py-2 font-mono text-[13px] font-semibold transition-colors',
            isSelected(mo)
              ? 'bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)]'
              : 'text-slate-700 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]',
            !isSelected(mo) && viewYear === thisYear && mo === thisMonth
              ? 'ring-1 ring-[#93C5FD]'
              : '',
          ]"
          @click="pick(mo)"
        >
          {{ String(mo).padStart(2, '0') }}월
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <button
          type="button"
          class="rounded-[8px] px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          @click="viewYear = thisYear"
        >
          올해로
        </button>
        <button
          v-if="modelValue"
          type="button"
          class="rounded-[8px] px-2.5 py-1.5 text-[12.5px] font-semibold text-red-500 transition-colors hover:bg-red-50"
          @click="clear"
        >
          지우기
        </button>
        <span v-else class="text-[12px] text-slate-300">월을 선택하세요</span>
      </div>
    </div>
  </div>
</template>
