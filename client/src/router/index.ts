import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { usePortfolioStore, ownerUsername } from '@/stores/portfolio'

const userChildren: RouteRecordRaw[] = [
  { path: '', name: 'user-home', component: () => import('@/views/HomeView.vue') },
  { path: 'about', name: 'user-about', component: () => import('@/views/AboutView.vue') },
  { path: 'projects', name: 'user-projects', component: () => import('@/views/ProjectsView.vue') },
  { path: 'projects/:slug', name: 'user-project-detail', component: () => import('@/views/ProjectDetailView.vue') },
  { path: 'projects/:slug/demo', name: 'user-project-demo', component: () => import('@/views/DemoView.vue') },
  { path: 'skills', name: 'user-skills', component: () => import('@/views/SkillsView.vue') },
  { path: 'contact', name: 'user-contact', component: () => import('@/views/ContactView.vue') },
]

const routes: RouteRecordRaw[] = [
  // `/`는 플랫폼 소개 랜딩. 개인 포트폴리오는 /u/:username
  { path: '/', name: 'landing', component: () => import('@/views/LandingView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  { path: '/projects', name: 'projects', component: () => import('@/views/ProjectsView.vue') },
  {
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetailView.vue'),
    props: true,
  },
  {
    path: '/projects/:slug/demo',
    name: 'project-demo',
    component: () => import('@/views/DemoView.vue'),
    props: true,
  },
  { path: '/skills', name: 'skills', component: () => import('@/views/SkillsView.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
  // ─── 다중 사용자 ───
  { path: '/u/:username', component: () => import('@/views/UserShell.vue'), children: userChildren },
  { path: '/explore', name: 'explore', component: () => import('@/views/ExploreView.vue') },
  { path: '/guide', name: 'guide', component: () => import('@/views/GuideView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/auth/callback', name: 'auth-callback', component: () => import('@/views/AuthCallbackView.vue') },
  { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// /u/:username 진입 시 해당 사용자 데이터 적재, 그 외는 주인 데이터 보장.
// 주인이 정해져 있으면 레거시 개인 경로(/about 등)는 /u/:owner 로 합류.
const legacyPersonal = /^\/(about|projects|skills|contact)(\/|$)/
router.beforeEach(async (to) => {
  try {
    const store = usePortfolioStore()
    const m = to.path.match(/^\/u\/([^/]+)/)
    if (m) {
      await store.loadUser(m[1])
      return
    }
    if (ownerUsername && legacyPersonal.test(to.path)) {
      return `/u/${ownerUsername.toLowerCase()}${to.path}`
    }
    await store.ensureOwner()
  } catch { /* 스토어 미준비/오프라인이면 기본값으로 렌더 */ }
})

export default router
