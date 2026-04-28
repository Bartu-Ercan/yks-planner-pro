'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const DERSLER = ['TYT Mat','TYT Türkçe','TYT Fen','TYT Sosyal','TYT Genel Deneme','AYT Mat','AYT Fizik','AYT Kimya','AYT Bio','AYT Edebiyat','AYT Tarih','AYT Genel Deneme']
const GUNLER = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz']

interface Gorev {
  id: string
  user_id?: string
  ders: string
  konu: string
  gun: number
  hafta: string
  tamam: boolean
  gercek_sure: number
  created_at: string
}

type TemaMode = 'dark' | 'light'

interface Tema {
  name: string
  mode: TemaMode
  primary: string
  primaryLight: string
  accent: string
  bg: string
  bgGradient: string
  card: string
  cardSoft: string
  border: string
  hoverBorder: string
  text: string
  textStrong: string
  muted: string
  faint: string
  onPrimary: string
  success: string
  successText: string
  overlay: string
  shadow: string
  hoverShadow: string
}

const TEMALAR: Record<string, Tema> = {
  mavi: {
    name: 'Okyanus',
    mode: 'dark',
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    accent: '#22d3ee',
    bg: '#070b14',
    bgGradient: 'linear-gradient(135deg, #070b14 0%, #0f172a 52%, #07111f 100%)',
    card: '#111827',
    cardSoft: '#030712',
    border: '#1f2937',
    hoverBorder: '#334155',
    text: '#e5e7eb',
    textStrong: '#f8fafc',
    muted: '#9ca3af',
    faint: '#4b5563',
    onPrimary: '#ffffff',
    success: '#22c55e',
    successText: '#052e16',
    overlay: 'rgba(0,0,0,0.8)',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  mor: {
    name: 'Gece',
    mode: 'dark',
    primary: '#a78bfa',
    primaryLight: '#c4b5fd',
    accent: '#f0abfc',
    bg: '#0b0714',
    bgGradient: 'linear-gradient(135deg, #0b0714 0%, #181026 52%, #0d0718 100%)',
    card: '#111827',
    cardSoft: '#05020a',
    border: '#2a2140',
    hoverBorder: '#4c1d95',
    text: '#ede9fe',
    textStrong: '#ffffff',
    muted: '#a1a1aa',
    faint: '#6b7280',
    onPrimary: '#1e103b',
    success: '#22c55e',
    successText: '#052e16',
    overlay: 'rgba(0,0,0,0.8)',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  yesil: {
    name: 'Orman',
    mode: 'dark',
    primary: '#10b981',
    primaryLight: '#34d399',
    accent: '#a3e635',
    bg: '#06100c',
    bgGradient: 'linear-gradient(135deg, #06100c 0%, #0f1f18 52%, #07130e 100%)',
    card: '#102018',
    cardSoft: '#03100a',
    border: '#1f3a2c',
    hoverBorder: '#2f6f52',
    text: '#dcfce7',
    textStrong: '#f7fee7',
    muted: '#9ca3af',
    faint: '#64748b',
    onPrimary: '#022c22',
    success: '#22c55e',
    successText: '#052e16',
    overlay: 'rgba(0,0,0,0.8)',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  kirmizi: {
    name: 'Ateş',
    mode: 'dark',
    primary: '#f43f5e',
    primaryLight: '#fb7185',
    accent: '#fb923c',
    bg: '#140707',
    bgGradient: 'linear-gradient(135deg, #140707 0%, #241111 52%, #160707 100%)',
    card: '#1f1418',
    cardSoft: '#100506',
    border: '#3b1d23',
    hoverBorder: '#7f1d1d',
    text: '#ffe4e6',
    textStrong: '#fff7ed',
    muted: '#a8a29e',
    faint: '#78716c',
    onPrimary: '#fff1f2',
    success: '#22c55e',
    successText: '#052e16',
    overlay: 'rgba(0,0,0,0.8)',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  turuncu: {
    name: 'Günbatımı',
    mode: 'dark',
    primary: '#f97316',
    primaryLight: '#fdba74',
    accent: '#facc15',
    bg: '#130b04',
    bgGradient: 'linear-gradient(135deg, #130b04 0%, #241606 52%, #170d04 100%)',
    card: '#1f1710',
    cardSoft: '#100803',
    border: '#3b2a18',
    hoverBorder: '#9a3412',
    text: '#ffedd5',
    textStrong: '#fff7ed',
    muted: '#a8a29e',
    faint: '#78716c',
    onPrimary: '#431407',
    success: '#22c55e',
    successText: '#052e16',
    overlay: 'rgba(0,0,0,0.8)',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  pembe: {
    name: 'Pembe Rüya',
    mode: 'dark',
    primary: '#ec4899',
    primaryLight: '#f472b6',
    accent: '#f59e0b',
    bg: '#140711',
    bgGradient: 'linear-gradient(135deg, #140711 0%, #241020 52%, #150814 100%)',
    card: '#1f1420',
    cardSoft: '#10050d',
    border: '#3a1f36',
    hoverBorder: '#831843',
    text: '#fce7f3',
    textStrong: '#fff7fb',
    muted: '#a8a29e',
    faint: '#78716c',
    onPrimary: '#fff7fb',
    success: '#22c55e',
    successText: '#052e16',
    overlay: 'rgba(0,0,0,0.8)',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    hoverShadow: '0 8px 24px rgba(0,0,0,0.3)'
  },
  sabah: {
    name: 'Sabah',
    mode: 'light',
    primary: '#d97706',
    primaryLight: '#f59e0b',
    accent: '#0891b2',
    bg: '#fff7ed',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #ecfeff 100%)',
    card: '#ffffff',
    cardSoft: '#fff7ed',
    border: '#fed7aa',
    hoverBorder: '#fb923c',
    text: '#3f2a1d',
    textStrong: '#1c1917',
    muted: '#9a3412',
    faint: '#c08457',
    onPrimary: '#ffffff',
    success: '#16a34a',
    successText: '#ffffff',
    overlay: 'rgba(67,20,7,0.34)',
    shadow: '0 20px 60px rgba(124,45,18,0.18)',
    hoverShadow: '0 8px 24px rgba(124,45,18,0.14)'
  },
  gokyuzu: {
    name: 'Gökyüzü',
    mode: 'light',
    primary: '#2563eb',
    primaryLight: '#60a5fa',
    accent: '#06b6d4',
    bg: '#eff6ff',
    bgGradient: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 48%, #ecfeff 100%)',
    card: '#ffffff',
    cardSoft: '#f1f5f9',
    border: '#bfdbfe',
    hoverBorder: '#60a5fa',
    text: '#1e293b',
    textStrong: '#0f172a',
    muted: '#475569',
    faint: '#94a3b8',
    onPrimary: '#ffffff',
    success: '#16a34a',
    successText: '#ffffff',
    overlay: 'rgba(15,23,42,0.36)',
    shadow: '0 20px 60px rgba(30,64,175,0.16)',
    hoverShadow: '0 8px 24px rgba(30,64,175,0.14)'
  },
  mint: {
    name: 'Mint',
    mode: 'light',
    primary: '#059669',
    primaryLight: '#34d399',
    accent: '#14b8a6',
    bg: '#ecfdf5',
    bgGradient: 'linear-gradient(135deg, #ecfdf5 0%, #f7fee7 50%, #f0fdfa 100%)',
    card: '#ffffff',
    cardSoft: '#f0fdf4',
    border: '#bbf7d0',
    hoverBorder: '#34d399',
    text: '#164e3b',
    textStrong: '#052e16',
    muted: '#047857',
    faint: '#86a79b',
    onPrimary: '#ffffff',
    success: '#16a34a',
    successText: '#ffffff',
    overlay: 'rgba(6,78,59,0.34)',
    shadow: '0 20px 60px rgba(5,150,105,0.16)',
    hoverShadow: '0 8px 24px rgba(5,150,105,0.14)'
  },
  lavanta: {
    name: 'Lavanta',
    mode: 'light',
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    accent: '#ec4899',
    bg: '#f5f3ff',
    bgGradient: 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #fff1f2 100%)',
    card: '#ffffff',
    cardSoft: '#faf5ff',
    border: '#ddd6fe',
    hoverBorder: '#a78bfa',
    text: '#312e81',
    textStrong: '#1e1b4b',
    muted: '#6d28d9',
    faint: '#a78bfa',
    onPrimary: '#ffffff',
    success: '#16a34a',
    successText: '#ffffff',
    overlay: 'rgba(49,46,129,0.34)',
    shadow: '0 20px 60px rgba(109,40,217,0.16)',
    hoverShadow: '0 8px 24px rgba(109,40,217,0.14)'
  },
  seftali: {
    name: 'Şeftali',
    mode: 'light',
    primary: '#ea580c',
    primaryLight: '#fb923c',
    accent: '#f43f5e',
    bg: '#fff1f2',
    bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #fff7ed 48%, #fffbeb 100%)',
    card: '#ffffff',
    cardSoft: '#fff7ed',
    border: '#fecdd3',
    hoverBorder: '#fb7185',
    text: '#4a1d1d',
    textStrong: '#1c1917',
    muted: '#be123c',
    faint: '#d68686',
    onPrimary: '#ffffff',
    success: '#16a34a',
    successText: '#ffffff',
    overlay: 'rgba(127,29,29,0.32)',
    shadow: '0 20px 60px rgba(190,18,60,0.16)',
    hoverShadow: '0 8px 24px rgba(190,18,60,0.14)'
  },
  studio: {
    name: 'Studio',
    mode: 'light',
    primary: '#111827',
    primaryLight: '#374151',
    accent: '#2563eb',
    bg: '#f8fafc',
    bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #eef2ff 100%)',
    card: '#ffffff',
    cardSoft: '#f1f5f9',
    border: '#cbd5e1',
    hoverBorder: '#64748b',
    text: '#1f2937',
    textStrong: '#0f172a',
    muted: '#475569',
    faint: '#94a3b8',
    onPrimary: '#ffffff',
    success: '#16a34a',
    successText: '#ffffff',
    overlay: 'rgba(15,23,42,0.36)',
    shadow: '0 20px 60px rgba(15,23,42,0.14)',
    hoverShadow: '0 8px 24px rgba(15,23,42,0.12)'
  },
}

const normalizeTemaKey = (key: string | null) => key && TEMALAR[key] ? key : 'mavi'

const DERS_RENKLERI: Record<string, string> = {
  'TYT Mat':'#60a5fa','TYT Türkçe':'#a78bfa','TYT Fen':'#34d399','TYT Sosyal':'#fbbf24',
  'TYT Genel Deneme':'#f87171',
  'AYT Mat':'#38bdf8','AYT Fizik':'#f472b6','AYT Kimya':'#fb923c','AYT Bio':'#4ade80',
  'AYT Edebiyat':'#c084fc','AYT Tarih':'#facc15',
  'AYT Genel Deneme':'#fb7185',
}

const DERS_RENKLERI_LIGHT: Record<string, string> = {
  'TYT Mat':'#2563eb','TYT Türkçe':'#7c3aed','TYT Fen':'#059669','TYT Sosyal':'#b45309',
  'TYT Genel Deneme':'#dc2626',
  'AYT Mat':'#0284c7','AYT Fizik':'#db2777','AYT Kimya':'#ea580c','AYT Bio':'#16a34a',
  'AYT Edebiyat':'#9333ea','AYT Tarih':'#ca8a04',
  'AYT Genel Deneme':'#e11d48',
}

const getDersRengi = (ders: string, mode: TemaMode) =>
  (mode === 'light' ? DERS_RENKLERI_LIGHT[ders] : DERS_RENKLERI[ders]) || '#888'

const haftaBaslangici = (offset = 0) => {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diff + offset * 7)
  mon.setHours(0, 0, 0, 0)
  return mon
}

const tarihId = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

const gunBaslangici = (offset = 0) => {
  const start = haftaBaslangici(0)
  start.setDate(start.getDate() + offset)
  return start
}

const haftaIdFromDate = (date: Date) => {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon = new Date(date)
  mon.setDate(date.getDate() + diff)
  mon.setHours(0, 0, 0, 0)
  return tarihId(mon)
}

const gunIndexFromDate = (date: Date) => date.getDay() === 0 ? 6 : date.getDay() - 1

const getGunBilgisi = (offset: number, column: number) => {
  const tarih = gunBaslangici(offset)
  tarih.setDate(tarih.getDate() + column)
  const gun = gunIndexFromDate(tarih)
  return { tarih, gun, hafta: haftaIdFromDate(tarih), label: GUNLER[gun] }
}

const formatHafta = (offset: number) => {
  const start = gunBaslangici(offset)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleString('tr', { month: 'short' })}`
  return `${fmt(start)} – ${fmt(end)}`
}

const formatSure = (dakika: number) => {
  if (!dakika) return ''
  const saat = Math.floor(dakika / 60)
  const dk = dakika % 60
  if (saat > 0 && dk > 0) return `${saat}s ${dk}dk`
  if (saat > 0) return `${saat}s`
  return `${dk}dk`
}

const createGuestId = () => Date.now().toString()

export default function Home() {
  const [gorevler, setGorevler] = useState<Gorev[]>([])
  const [gunOffset, setGunOffset] = useState(0)
  const [ekleGun, setEkleGun] = useState<number | null>(null)
  const [formKonu, setFormKonu] = useState('')
  const [formDers, setFormDers] = useState('TYT Mat')
  const [topluAcik, setTopluAcik] = useState(false)
  const [topluKonu, setTopluKonu] = useState('')
  const [topluDers, setTopluDers] = useState('TYT Mat')
  const [seciliGunler, setSeciliGunler] = useState<number[]>([])
  const [topluHaftalar, setTopluHaftalar] = useState('bu')
  const [sureModal, setSureModal] = useState<Gorev | null>(null)
  const [sureInput, setSureInput] = useState('')
  const [detayModal, setDetayModal] = useState<Gorev | null>(null)
  const [kopyaDrag, setKopyaDrag] = useState<Gorev | null>(null)
  const [kopyaKonum, setKopyaKonum] = useState({ x: 0, y: 0 })
  const [editKonu, setEditKonu] = useState('')
  const [editDers, setEditDers] = useState('')
  const [bitmeyenAcik, setBitmeyenAcik] = useState(false)
  const [tasimaHedef, setTasimaHedef] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [ayarlarAcik, setAyarlarAcik] = useState(false)
  const [authModal, setAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [guestMigrate, setGuestMigrate] = useState(false)
  const [aktifTema, setAktifTema] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizeTemaKey(localStorage.getItem('yks-tema'))
    }
    return 'mavi'
  })
  const [temaSekmesi, setTemaSekmesi] = useState<TemaMode>(() => {
    if (typeof window !== 'undefined') {
      return TEMALAR[normalizeTemaKey(localStorage.getItem('yks-tema'))].mode
    }
    return 'dark'
  })
  const [draggingTask, setDraggingTask] = useState<Gorev | null>(null)
  const [dragOverDay, setDragOverDay] = useState<number | null>(null)
  const [bildirim, setBildirim] = useState<string | null>(null)

  const tema = TEMALAR[aktifTema]
  const gorunenGunler = Array.from({ length: 7 }, (_, i) => getGunBilgisi(gunOffset, i))
  const gorunenHaftalar = Array.from(new Set(gorunenGunler.map(g => g.hafta)))
  const seciliTemaListesi = Object.entries(TEMALAR).filter(([, t]) => t.mode === temaSekmesi)

  const bildir = (mesaj: string) => {
    setBildirim(mesaj)
    setTimeout(() => setBildirim(null), 1500)
  }

  const getYarinIndex = () => {
    const yarin = new Date()
    yarin.setDate(yarin.getDate() + 1)
    const yarinId = tarihId(yarin)
    return gorunenGunler.findIndex(g => tarihId(g.tarih) === yarinId)
  }

  const openBitmeyenPanel = () => {
    const yarinIndex = getYarinIndex()
    setTasimaHedef(yarinIndex >= 0 ? yarinIndex : 0)
    setBitmeyenAcik(v => !v)
    setTopluAcik(false)
  }

  const kopyaBaslat = (gorev: Gorev, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setKopyaDrag(gorev)
    setKopyaKonum({ x: e.clientX, y: e.clientY })
    setDraggingTask(null)
    setDragOverDay(null)
  }

  useEffect(() => {
    localStorage.setItem('yks-tema', aktifTema)
    setTemaSekmesi(TEMALAR[aktifTema].mode)
  }, [aktifTema])

  useEffect(() => {
    if (!kopyaDrag) return

    const handleMouseMove = (event: MouseEvent) => {
      setKopyaKonum({ x: event.clientX, y: event.clientY })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setKopyaDrag(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [kopyaDrag])

  async function loadGorevler(currentUser: User | null) {
    if (!currentUser) {
      const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
      setGorevler(local.filter((g: Gorev) => gorunenHaftalar.includes(g.hafta)))
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('gorevler')
      .select('*')
      .in('hafta', gorunenHaftalar)
      .order('created_at')

    if (data) setGorevler(data as Gorev[])
    setLoading(false)
  }

  async function migrateGuestTasks(currentUser: User) {
    const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
    if (local.length === 0 || guestMigrate) return

    setGuestMigrate(true)
    const toMigrate = local.map((g: Gorev) => ({
      ...g,
      user_id: currentUser.id,
      id: undefined // Let Supabase generate new IDs
    }))

    if (toMigrate.length > 0) {
      await supabase.from('gorevler').insert(toMigrate)
      localStorage.removeItem('yks-gorevler')
      loadGorevler(currentUser)
    }
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      loadGorevler(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        loadGorevler(u)
        // Migrate guest tasks if needed
        migrateGuestTasks(u)
      } else {
        loadGorevler(null)
      }
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
      subscription.unsubscribe()
    }
  }, [gunOffset])

  const handleAuth = async () => {
    setAuthLoading(true)
    setAuthError('')

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Email ve şifre gerekli')
      setAuthLoading(false)
      return
    }

    if (authMode === 'register' && authPassword.length < 6) {
      setAuthError('Şifre en az 6 karakter olmalı')
      setAuthLoading(false)
      return
    }

    const { error } = authMode === 'login'
      ? await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword })
      : await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword })

    if (error) {
      setAuthError(error.message)
    } else {
      setAuthModal(false)
      setAuthEmail('')
      setAuthPassword('')
    }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setGuestMigrate(false)
    loadGorevler(null)
  }

  const saveGuest = (newGorevler: Gorev[]) => {
    const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
    const otherWeeks = local.filter((g: Gorev) => !gorunenHaftalar.includes(g.hafta))
    localStorage.setItem('yks-gorevler', JSON.stringify([...otherWeeks, ...newGorevler]))
  }

  const ekle = async () => {
    if (!formKonu.trim() || ekleGun === null) return
    const hedefGun = gorunenGunler[ekleGun]

    const yeniGorev: Omit<Gorev, 'id' | 'created_at'> = {
      ders: formDers,
      konu: formKonu.trim(),
      gun: hedefGun.gun,
      hafta: hedefGun.hafta,
      tamam: false,
      gercek_sure: 0,
      ...(user ? { user_id: user.id } : {})
    }

    if (!user) {
      const yeni: Gorev = { ...yeniGorev, id: createGuestId(), created_at: new Date().toISOString() }
      const updated = [...gorevler, yeni]
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { data, error } = await supabase.from('gorevler').insert(yeniGorev).select().single()
      if (error) {
        console.error('Supabase insert error:', error)
        alert('Görev eklenemedi: ' + error.message)
        return
      }
      if (data) setGorevler([...gorevler, data as Gorev])
    }

    setFormKonu('')
    setEkleGun(null)
  }

  const topluEkle = async () => {
    if (!topluKonu.trim() || seciliGunler.length === 0) return

    const tekrarSayisi = topluHaftalar === 'bu' ? 1 : topluHaftalar === 'sonraki' ? 2 : 8
    const hedefGunler = Array.from({ length: tekrarSayisi }, (_, hafta) =>
      seciliGunler.map(column => getGunBilgisi(gunOffset + column + hafta * 7, 0))
    ).flat()

    if (!user) {
      const yeniGorevler: Gorev[] = hedefGunler.map((hedef, i) => ({
        id: `${Date.now()}-${i}-${hedef.hafta}-${hedef.gun}`,
        ders: topluDers,
        konu: topluKonu.trim(),
        gun: hedef.gun,
        hafta: hedef.hafta,
        tamam: false,
        gercek_sure: 0,
        created_at: new Date().toISOString()
      }))
      const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
      localStorage.setItem('yks-gorevler', JSON.stringify([...local, ...yeniGorevler]))
      const updated = [...gorevler, ...yeniGorevler.filter(g => gorunenHaftalar.includes(g.hafta))]
      setGorevler(updated)
    } else {
      const toInsert = hedefGunler.map(hedef => ({
        ders: topluDers,
        konu: topluKonu.trim(),
        gun: hedef.gun,
        hafta: hedef.hafta,
        tamam: false,
        gercek_sure: 0,
        user_id: user.id
      }))
      const { data, error } = await supabase.from('gorevler').insert(toInsert).select()
      if (error) {
        console.error('Toplu ekleme hatası:', error)
        alert('Görevler eklenemedi: ' + error.message)
        return
      }
      if (data) setGorevler([...gorevler, ...(data as Gorev[]).filter(g => gorunenHaftalar.includes(g.hafta))])
    }

    setTopluKonu('')
    setSeciliGunler([])
    setTopluAcik(false)
  }

  const gorevCogalt = async (hedefIndex: number) => {
    if (!kopyaDrag) return
    const hedefGun = gorunenGunler[hedefIndex]

    const yeniGorev: Omit<Gorev, 'id' | 'created_at'> = {
      ders: kopyaDrag.ders,
      konu: kopyaDrag.konu,
      gun: hedefGun.gun,
      hafta: hedefGun.hafta,
      tamam: false,
      gercek_sure: 0,
      ...(user ? { user_id: user.id } : {})
    }

    if (!user) {
      const yeni: Gorev = { ...yeniGorev, id: createGuestId(), created_at: new Date().toISOString() }
      const updated = [...gorevler, yeni]
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { data, error } = await supabase.from('gorevler').insert(yeniGorev).select().single()
      if (error) {
        console.error('Görev çoğaltma hatası:', error)
        alert('Görev çoğaltılamadı: ' + error.message)
        return
      }
      if (data) setGorevler([...gorevler, data as Gorev])
    }

    setKopyaDrag(null)
    bildir(`Görev ${hedefGun.label} gününe kopyalandı`)
  }

  const bitmeyenleriTasi = async () => {
    const hedefGun = gorunenGunler[tasimaHedef]
    const tasinacaklar = gorevler.filter(g =>
      !g.tamam &&
      gorunenGunler.some(gun => gun.hafta === g.hafta && gun.gun === g.gun) &&
      !(g.hafta === hedefGun.hafta && g.gun === hedefGun.gun)
    )

    if (tasinacaklar.length === 0) {
      setBitmeyenAcik(false)
      return
    }

    if (!user) {
      const updated = gorevler.map(g =>
        tasinacaklar.some(t => t.id === g.id) ? { ...g, gun: hedefGun.gun, hafta: hedefGun.hafta } : g
      )
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { error } = await supabase
        .from('gorevler')
        .update({ gun: hedefGun.gun, hafta: hedefGun.hafta })
        .in('id', tasinacaklar.map(g => g.id))

      if (error) {
        console.error('Bitmeyenleri taşıma hatası:', error)
        alert('Görevler taşınamadı: ' + error.message)
        return
      }
      setGorevler(gorevler.map(g =>
        tasinacaklar.some(t => t.id === g.id) ? { ...g, gun: hedefGun.gun, hafta: hedefGun.hafta } : g
      ))
    }

    setBitmeyenAcik(false)
    bildir(`${tasinacaklar.length} görev ${hedefGun.label} gününe taşındı`)
  }

  const tickla = async (gorev: Gorev) => {
    if (!gorev.tamam) {
      setSureModal(gorev)
      setSureInput('')
    } else {
      if (!user) {
        const updated = gorevler.map(g => g.id === gorev.id ? { ...g, tamam: false, gercek_sure: 0 } : g)
        setGorevler(updated)
        saveGuest(updated)
      } else {
        await supabase.from('gorevler').update({ tamam: false, gercek_sure: 0 }).eq('id', gorev.id)
        setGorevler(gorevler.map(g => g.id === gorev.id ? { ...g, tamam: false, gercek_sure: 0 } : g))
      }
    }
  }

  const sureKaydet = async () => {
    if (!sureModal) return
    const sure = parseInt(sureInput) || 0

    if (!user) {
      const updated = gorevler.map(g => g.id === sureModal.id ? { ...g, tamam: true, gercek_sure: sure } : g)
      setGorevler(updated)
      saveGuest(updated)
    } else {
      await supabase.from('gorevler').update({ tamam: true, gercek_sure: sure }).eq('id', sureModal.id)
      setGorevler(gorevler.map(g => g.id === sureModal.id ? { ...g, tamam: true, gercek_sure: sure } : g))
    }

    setSureModal(null)
    setSureInput('')
  }

  const sil = async (id: string) => {
    if (!user) {
      const updated = gorevler.filter(g => g.id !== id)
      setGorevler(updated)
      saveGuest(updated)
    } else {
      await supabase.from('gorevler').delete().eq('id', id)
      setGorevler(gorevler.filter(g => g.id !== id))
    }
  }

  const detayAc = (gorev: Gorev) => {
    setDetayModal(gorev)
    setEditKonu(gorev.konu)
    setEditDers(gorev.ders)
  }

  const detayKaydet = async () => {
    if (!detayModal || !editKonu.trim()) return

    const updatedData = { konu: editKonu.trim(), ders: editDers }

    if (!user) {
      const updated = gorevler.map(g =>
        g.id === detayModal.id ? { ...g, ...updatedData } : g
      )
      setGorevler(updated)
      saveGuest(updated)
    } else {
      await supabase.from('gorevler').update(updatedData).eq('id', detayModal.id)
      setGorevler(gorevler.map(g =>
        g.id === detayModal.id ? { ...g, ...updatedData } : g
      ))
    }

    setDetayModal(null)
  }

  const toggleGun = (i: number) => {
    setSeciliGunler(gs => gs.includes(i) ? gs.filter(x => x !== i) : [...gs, i])
  }

  const handleDragStart = (gorev: Gorev) => {
    setKopyaDrag(null)
    setDraggingTask(gorev)
  }

  const handleDragOver = (e: React.DragEvent, gunIdx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverDay(gunIdx)
  }

  const handleDragLeave = () => {
    setDragOverDay(null)
  }

  const handleDrop = async (targetGun: number) => {
    if (!draggingTask) return
    const hedefGun = gorunenGunler[targetGun]
    
    // If dropping on the same day, do nothing
    if (draggingTask.gun === hedefGun.gun && draggingTask.hafta === hedefGun.hafta) {
      setDraggingTask(null)
      setDragOverDay(null)
      return
    }

    const updatedTask = { ...draggingTask, gun: hedefGun.gun, hafta: hedefGun.hafta }

    if (!user) {
      const updated = gorevler.map(g => g.id === draggingTask.id ? updatedTask : g)
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { error } = await supabase
        .from('gorevler')
        .update({ gun: hedefGun.gun, hafta: hedefGun.hafta })
        .eq('id', draggingTask.id)
      
      if (error) {
        console.error('Task move error:', error)
        alert('Görev taşınamadı: ' + error.message)
        return
      }
      setGorevler(gorevler.map(g => g.id === draggingTask.id ? updatedTask : g))
    }

    bildir(`Görev ${hedefGun.label} gününe taşındı`)

    setDraggingTask(null)
    setDragOverDay(null)
  }

  const handleDragEnd = () => {
    setDraggingTask(null)
    setDragOverDay(null)
  }

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:tema.bg }}>
        <p style={{ color:tema.faint, fontSize:12, fontFamily:"'DM Mono', monospace" }}>yükleniyor...</p>
      </div>
    )
  }

  const aktifGorevler = gorevler.filter(g => gorunenGunler.some(gun => gun.hafta === g.hafta && gun.gun === g.gun))
  const toplamTamam = aktifGorevler.filter(g => g.tamam).length
  const yuzde = aktifGorevler.length ? Math.round((toplamTamam / aktifGorevler.length) * 100) : 0
  const bitmeyenSayisi = aktifGorevler.filter(g => !g.tamam).length
  const tasimaHedefGun = gorunenGunler[tasimaHedef]
  const tasinabilirSayisi = aktifGorevler.filter(g =>
    !g.tamam && tasimaHedefGun && !(g.hafta === tasimaHedefGun.hafta && g.gun === tasimaHedefGun.gun)
  ).length

  const getGunToplamSure = (gunIdx: number) => {
    const hedefGun = gorunenGunler[gunIdx]
    const gunGorevler = aktifGorevler.filter(g => g.hafta === hedefGun.hafta && g.gun === hedefGun.gun && g.tamam)
    return gunGorevler.reduce((toplam, g) => toplam + (g.gercek_sure || 0), 0)
  }

  return (
    <div style={{ background:tema.bgGradient, minHeight:'100vh', color:tema.text, fontFamily:"'DM Mono', monospace", padding: isMobile ? '1rem 0.5rem 3rem' : '1.5rem 1rem 3rem' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        .slide-in { animation: slideIn 0.2s ease-out; }
        .slide-up { animation: slideUp 0.3s ease-out; }
        .btn-hover { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: ${tema.hoverShadow}; }
        .btn-hover:active { transform: translateY(0); }
        .gorev-card { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); backdrop-filter: blur(8px); }
        .gorev-card:hover { transform: translateY(-2px); box-shadow: ${tema.hoverShadow}; border-color: ${tema.hoverBorder} !important; }
        .gorev-card.dragging { opacity: 0.5; transform: rotate(2deg) scale(0.98); cursor: grabbing; }
        .day-column { transition: all 0.2s ease; }
        .day-column.drag-over { background: ${tema.primary}10; border-radius: 12px; }
        .progress-bar { transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        input:focus, select:focus { border-color: ${tema.primary} !important; outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${tema.card}; }
        ::-webkit-scrollbar-thumb { background: ${tema.border}; border-radius: 2px; }
      `}</style>

      {/* SÜRE MODAL */}
      {sureModal && (
        <div className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:440, width:'100%', boxShadow:tema.shadow }}>
            <p style={{ margin:'0 0 6px', fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase' }}>Görev Tamamlandı 🎉</p>
            <p style={{ margin:'0 0 6px', fontSize:20, color:tema.textStrong, fontWeight:600 }}>{sureModal.konu}</p>
            <p style={{ margin:'0 0 24px', fontSize:13, color:getDersRengi(sureModal.ders, tema.mode) }}>{sureModal.ders}</p>
            <p style={{ margin:'0 0 12px', fontSize:14, color:tema.text }}>Kaç dakikada tamamladın?</p>
            <input autoFocus value={sureInput} onChange={e => setSureInput(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') sureKaydet(); if(e.key==='Escape') setSureModal(null); }}
              type="number" min="0" placeholder="örn: 45"
              style={{ width:'100%', background:tema.cardSoft, border:`2px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:28, padding:'16px 20px', outline:'none', textAlign:'center', fontWeight:700, boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <button onClick={() => setSureModal(null)} className="btn-hover" style={{ flex:1, fontSize:14, padding:'14px 0', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.faint, cursor:'pointer' }}>iptal</button>
              <button onClick={sureKaydet} className="btn-hover" style={{ flex:1, fontSize:14, padding:'14px 0', background:tema.success, border:'none', borderRadius:12, color:tema.successText, fontWeight:600, cursor:'pointer' }}>kaydet ✓</button>
            </div>
            <button onClick={() => {
              const updated = gorevler.map(g => g.id === sureModal.id ? { ...g, tamam:true, gercek_sure:0 } : g)
              setGorevler(updated)
              if (user) {
                supabase.from('gorevler').update({ tamam:true, gercek_sure:0 }).eq('id', sureModal.id)
              } else {
                saveGuest(updated)
              }
              setSureModal(null)
              setSureInput('')
            }}
              style={{ width:'100%', marginTop:12, padding:'12px 0', background:'none', border:'none', color:tema.faint, cursor:'pointer', fontSize:12 }}>süre bilmiyorum, sadece tamamla</button>
          </div>
        </div>
      )}

      {/* DETAY MODAL */}
      {detayModal && (
        <div className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:440, width:'100%', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase' }}>Görev Detayları</p>
                <p style={{ margin:'4px 0 0', fontSize:20, color:tema.textStrong, fontWeight:600 }}>Görevi Düzenle</p>
              </div>
              <button onClick={() => setDetayModal(null)} className="btn-hover" style={{ background:tema.border, border:'none', color:tema.muted, cursor:'pointer', fontSize:18, width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>

            <p style={{ margin:'0 0 8px', fontSize:12, color:tema.muted, fontWeight:500 }}>Görev Adı</p>
            <input autoFocus value={editKonu} onChange={e => setEditKonu(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') detayKaydet(); if(e.key==='Escape') setDetayModal(null); }}
              placeholder="görev adı..."
              style={{ width:'100%', background:tema.cardSoft, border:`2px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:16, padding:'14px 16px', outline:'none', boxSizing:'border-box', marginBottom:20 }} />

            <p style={{ margin:'0 0 8px', fontSize:12, color:tema.muted, fontWeight:500 }}>Ders</p>
            <select value={editDers} onChange={e => setEditDers(e.target.value)}
              style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:14, padding:'14px 16px', outline:'none', boxSizing:'border-box', marginBottom:24, appearance:'none', WebkitAppearance:'none' }}>
              {DERSLER.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setDetayModal(null)} className="btn-hover" style={{ flex:1, fontSize:14, padding:'14px 0', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.faint, cursor:'pointer' }}>iptal</button>
              <button onClick={detayKaydet} className="btn-hover" style={{ flex:1, fontSize:14, padding:'14px 0', background:tema.primary, border:'none', borderRadius:12, color:tema.onPrimary, fontWeight:600, cursor:'pointer' }}>kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authModal && (
        <div className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:420, width:'100%', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <p style={{ margin:0, fontSize:18, color:tema.textStrong, fontWeight:600 }}>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</p>
                <p style={{ margin:'4px 0 0', fontSize:12, color:tema.faint }}>Görevlerin cloud&apos;da kayıtlı kalsın</p>
              </div>
              <button onClick={() => { setAuthModal(false); setAuthError(''); }} className="btn-hover" style={{ background:tema.cardSoft, border:'none', color:tema.muted, cursor:'pointer', fontSize:18, width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>

            {authError && (
              <div style={{ marginBottom:16, padding:'10px 14px', background:'#7f1d1d30', border:'1px solid #7f1d1d', borderRadius:10, fontSize:12, color:'#fca5a5' }}>
                {authError}
              </div>
            )}

            <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="email" type="email"
              style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:15, padding:'14px 16px', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
            <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="şifre (min 6 karakter)" type="password"
              onKeyDown={e => { if(e.key==='Enter') handleAuth(); }}
              style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:15, padding:'14px 16px', outline:'none', boxSizing:'border-box' }} />

            <button onClick={handleAuth} disabled={authLoading}
              style={{ width:'100%', marginTop:16, padding:'14px 0', background:tema.primary, border:'none', borderRadius:12, color:tema.onPrimary, fontWeight:600, fontSize:14, cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.6 : 1 }}>
              {authLoading ? 'bekle...' : authMode === 'login' ? 'giriş yap' : 'kayıt ol'}
            </button>

            <div style={{ marginTop:16, textAlign:'center' }}>
              <button onClick={() => { setAuthMode(m => m === 'login' ? 'register' : 'login'); setAuthError(''); }}
                style={{ background:'none', border:'none', color:tema.primaryLight, cursor:'pointer', fontSize:13 }}>
                {authMode === 'login' ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AYARLAR MODAL */}
      {ayarlarAcik && (
        <div className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:480, width:'100%', maxHeight:'85vh', overflowY:'auto', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <p style={{ margin:0, fontSize:18, color:tema.textStrong, fontWeight:600 }}>Tema Ayarları</p>
                <p style={{ margin:'4px 0 0', fontSize:12, color:tema.faint }}>Uygulamanın görünümünü özelleştir</p>
              </div>
              <button onClick={() => setAyarlarAcik(false)} className="btn-hover" style={{ background:tema.cardSoft, border:'none', color:tema.muted, cursor:'pointer', fontSize:18, width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, padding:4, marginBottom:16, background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12 }}>
              {(['dark','light'] as TemaMode[]).map(mode => {
                const active = temaSekmesi === mode
                return (
                  <button
                    key={mode}
                    onClick={() => setTemaSekmesi(mode)}
                    className="btn-hover"
                    style={{
                      padding:'10px 0',
                      border:'none',
                      borderRadius:8,
                      background: active ? tema.primary : 'transparent',
                      color: active ? tema.onPrimary : tema.muted,
                      cursor:'pointer',
                      fontSize:12,
                      fontWeight:600,
                      letterSpacing:0.4
                    }}
                  >
                    {mode === 'dark' ? 'Dark' : 'Light'}
                  </button>
                )
              })}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
              {seciliTemaListesi.map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setAktifTema(key)}
                  className="btn-hover"
                  style={{
                    padding:'20px 16px',
                    borderRadius:16,
                    border: aktifTema === key ? `2px solid ${t.primary}` : `1px solid ${tema.border}`,
                    background: t.bgGradient,
                    cursor:'pointer',
                    textAlign:'left',
                    position:'relative',
                    overflow:'hidden',
                    transition:'all 0.2s'
                  }}
                >
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:t.primary, border:`1px solid ${t.border}` }} />
                    <div style={{ width:24, height:24, borderRadius:6, background:t.primaryLight, border:`1px solid ${t.border}` }} />
                    <div style={{ width:24, height:24, borderRadius:6, background:t.accent, border:`1px solid ${t.border}` }} />
                  </div>
                  <p style={{ margin:0, fontSize:14, color:t.textStrong, fontWeight:600 }}>{t.name}</p>
                  {aktifTema === key && (
                    <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:t.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="12" height="10" viewBox="0 0 10 7"><path d="M1.5 3.5L3.5 5.5L8.5 1.5" stroke={t.onPrimary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Başlık + nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ margin:0, fontSize:11, color:tema.faint, letterSpacing:2.5, textTransform:'uppercase' }}>2026 YKS</p>
          <h1 style={{ margin:'4px 0 0', fontSize: isMobile ? 18 : 22, fontWeight:600, color:tema.textStrong, letterSpacing:'-0.5px' }}>Haftalık Program</h1>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:10, color:tema.faint }}>{user.email}</span>
              <button onClick={handleLogout} className="btn-hover" style={{ fontSize:10, padding:'5px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:6, color:tema.faint, cursor:'pointer' }}>çıkış</button>
            </div>
          ) : (
            <button onClick={() => { setAuthModal(true); setAuthMode('login'); setAuthError(''); }} className="btn-hover" style={{ fontSize:10, padding:'5px 12px', background:tema.primary, border:'none', borderRadius:6, color:tema.onPrimary, cursor:'pointer', fontWeight:500 }}>giriş yap</button>
          )}
          <button onClick={() => setAyarlarAcik(true)} className="btn-hover" style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:8, color:tema.muted, cursor:'pointer', fontSize:16, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>⚙</button>
          <button onClick={() => { setGunOffset(o => o-1); }} className="btn-hover" style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:8, color:tema.muted, cursor:'pointer', fontSize:16, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <div style={{ textAlign:'center', minWidth:80 }}>
            <p style={{ margin:0, fontSize:11, fontWeight:500, color: gunOffset===0 ? tema.primary:tema.faint }}>
              {gunOffset===0 ? 'bu hafta' : gunOffset>0 ? `+${gunOffset} gün` : `${gunOffset} gün`}
            </p>
            <p style={{ margin:'2px 0 0', fontSize:10, color:tema.faint }}>{formatHafta(gunOffset)}</p>
          </div>
          <button onClick={() => { setGunOffset(o => o+1); }} className="btn-hover" style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:8, color:tema.muted, cursor:'pointer', fontSize:16, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
          <div style={{ width:54, display:'flex', justifyContent:'flex-end' }}>
            <button onClick={() => setGunOffset(0)} className="btn-hover" style={{ visibility: gunOffset !== 0 ? 'visible' : 'hidden', pointerEvents: gunOffset !== 0 ? 'auto' : 'none', background:tema.primary, border:'none', borderRadius:6, color:tema.onPrimary, cursor:'pointer', fontSize:10, fontWeight:500, padding:'5px 10px' }}>bugün</button>
          </div>
        </div>
      </div>

      {/* İlerleme */}
      <div style={{ background:tema.card, borderRadius:12, padding:'12px 16px', marginBottom:'1rem', border:`1px solid ${tema.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
          <span style={{ fontSize:11, color:tema.muted, fontWeight:500 }}>Haftalık İlerleme</span>
          <span style={{ fontSize:12, color:tema.primaryLight, fontWeight:600 }}>{yuzde}%</span>
        </div>
        <div style={{ flex:1, height:4, background:tema.border, borderRadius:99, overflow:'hidden' }}>
          <div className="progress-bar" style={{ height:'100%', width:`${yuzde}%`, background:`linear-gradient(90deg, ${tema.primary}, ${tema.accent})`, borderRadius:99 }} />
        </div>
        <p style={{ margin:'4px 0 0', fontSize:10, color:tema.faint }}>{toplamTamam}/{aktifGorevler.length} görev tamamlandı</p>
      </div>

      {/* Hızlı aksiyonlar */}
      <div style={{ marginBottom:'1rem', display:'flex', gap:8, flexWrap:'wrap' }}>
        <button onClick={() => setTopluAcik(v => !v)} className="btn-hover" style={{ fontSize:11, padding:'8px 16px', background: topluAcik?tema.primary:tema.card, border:`1px solid ${topluAcik ? tema.primary : tema.border}`, borderRadius:8, color: topluAcik?tema.onPrimary:tema.muted, cursor:'pointer', letterSpacing:0.5, fontWeight:500 }}>
          {topluAcik ? '× kapat' : '⊕ toplu görev ekle'}
        </button>
        <button onClick={openBitmeyenPanel} disabled={bitmeyenSayisi === 0} className="btn-hover" style={{ fontSize:11, padding:'8px 16px', background: bitmeyenAcik?tema.primary:tema.card, border:`1px solid ${bitmeyenAcik ? tema.primary : tema.border}`, borderRadius:8, color: bitmeyenAcik?tema.onPrimary:tema.muted, cursor: bitmeyenSayisi === 0 ? 'not-allowed' : 'pointer', opacity: bitmeyenSayisi === 0 ? 0.45 : 1, letterSpacing:0.5, fontWeight:500 }}>
          {bitmeyenAcik ? '× kapat' : `bitmeyenleri taşı (${bitmeyenSayisi})`}
        </button>
      </div>

      {/* Bitmeyenleri taşı paneli */}
      {bitmeyenAcik && (
        <div className="slide-in" style={{ padding:'18px 20px', border:`1px solid ${tema.border}`, borderRadius:14, background:tema.card, marginBottom:'1rem', display:'flex', flexDirection:'column', gap:14 }}>
          <p style={{ margin:0, fontSize:13, color:tema.muted, fontWeight:600, letterSpacing:1, textTransform:'uppercase' }}>Bitmeyenleri Taşı</p>
          <p style={{ margin:0, fontSize:12, color:tema.faint }}>{tasinabilirSayisi} tamamlanmamış görev seçilen güne taşınacak.</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {gorunenGunler.map((g,i) => {
              const selected = tasimaHedef === i
              const yarin = getYarinIndex() === i
              return (
                <button key={i} onClick={() => setTasimaHedef(i)} className="btn-hover" style={{ padding:'10px 14px', fontSize:12, borderRadius:8, cursor:'pointer', border: selected?`1px solid ${tema.primary}`:`1px solid ${tema.border}`, background: selected?tema.primary:tema.cardSoft, color: selected?tema.onPrimary:tema.muted, fontWeight: selected ? 500 : 400 }}>{g.label}{yarin ? ' yarın' : ''}</button>
              )
            })}
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button onClick={() => setBitmeyenAcik(false)} className="btn-hover" style={{ fontSize:13, padding:'12px 20px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.faint, cursor:'pointer' }}>iptal</button>
            <button onClick={bitmeyenleriTasi} disabled={tasinabilirSayisi === 0} className="btn-hover" style={{ fontSize:13, padding:'12px 20px', background:tema.primary, border:'none', borderRadius:10, color:tema.onPrimary, fontWeight:600, cursor: tasinabilirSayisi === 0 ? 'not-allowed' : 'pointer', opacity: tasinabilirSayisi === 0 ? 0.55 : 1 }}>
              taşı
            </button>
          </div>
        </div>
      )}

      {/* Toplu ekleme paneli */}
      {topluAcik && (
        <div className="slide-in" style={{ padding:'20px 22px', border:`1px solid ${tema.border}`, borderRadius:14, background:tema.card, marginBottom:'1rem', display:'flex', flexDirection:'column', gap:14 }}>
          <p style={{ margin:0, fontSize:13, color:tema.muted, fontWeight:600, letterSpacing:1, textTransform:'uppercase' }}>Toplu Görev Ekle</p>
          <input autoFocus value={topluKonu} onChange={e => setTopluKonu(e.target.value)} placeholder="konu (örn: TYT denemesi)..."
            style={{ background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.text, fontSize:15, padding:'14px 14px', outline:'none' }} />
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <select value={topluDers} onChange={e => setTopluDers(e.target.value)} style={{ fontSize:13, padding:'12px 14px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, appearance:'none', WebkitAppearance:'none' }}>
              {DERSLER.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <p style={{ margin:'0 0 10px', fontSize:12, color:tema.faint, fontWeight:500 }}>Hangi günlere?</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {gorunenGunler.map((g,i) => (
                <button key={i} onClick={() => toggleGun(i)} className="btn-hover" style={{ padding:'10px 14px', fontSize:12, borderRadius:8, cursor:'pointer', border: seciliGunler.includes(i)?`1px solid ${tema.primary}`:`1px solid ${tema.border}`, background: seciliGunler.includes(i)?tema.primary:tema.cardSoft, color: seciliGunler.includes(i)?tema.onPrimary:tema.muted, fontWeight: seciliGunler.includes(i) ? 500 : 400 }}>{g.label}</button>
              ))}
              <button onClick={() => setSeciliGunler([0,1,2,3,4,5,6])} className="btn-hover" style={{ padding:'10px 14px', fontSize:12, borderRadius:8, cursor:'pointer', border:`1px solid ${tema.border}`, background:tema.cardSoft, color:tema.faint }}>hepsi</button>
            </div>
          </div>
          <div>
            <p style={{ margin:'0 0 10px', fontSize:12, color:tema.faint, fontWeight:500 }}>Hangi haftalara?</p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[['bu','bu hafta'],['sonraki','bu + sonraki'],['her','8 hafta ileriye']].map(([val,label]) => (
                <button key={val} onClick={() => setTopluHaftalar(val)} className="btn-hover" style={{ padding:'10px 14px', fontSize:12, borderRadius:8, cursor:'pointer', border: topluHaftalar===val?`1px solid ${tema.primary}`:`1px solid ${tema.border}`, background: topluHaftalar===val?tema.primary:tema.cardSoft, color: topluHaftalar===val?tema.onPrimary:tema.faint, fontWeight: topluHaftalar===val ? 500 : 400 }}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button onClick={() => setTopluAcik(false)} className="btn-hover" style={{ fontSize:13, padding:'12px 20px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.faint, cursor:'pointer' }}>iptal</button>
            <button onClick={topluEkle} className="btn-hover" style={{ fontSize:13, padding:'12px 20px', background:tema.primary, border:'none', borderRadius:10, color:tema.onPrimary, fontWeight:600, cursor:'pointer' }}>
              ekle ({seciliGunler.length} gün)
            </button>
          </div>
        </div>
      )}

      {/* 7 kolon grid */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(7, minmax(110px, 1fr))' : 'repeat(7, minmax(0, 1fr))', gap:8, alignItems:'start', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '8px' : 0 }}>
        {gorunenGunler.map((gunBilgisi,i) => {
          const gunGorevler = aktifGorevler.filter(g => g.hafta === gunBilgisi.hafta && g.gun === gunBilgisi.gun)
          const tamam = gunGorevler.filter(g => g.tamam).length
          const isBugun = tarihId(gunBilgisi.tarih) === tarihId(new Date())
          const formAcik = ekleGun === i
          const gunToplamSure = getGunToplamSure(i)
          const isDragOver = dragOverDay === i
          return (
            <div 
              key={i} 
              className={`fade-in day-column ${isDragOver || kopyaDrag ? 'drag-over' : ''}`} 
              onClickCapture={(e) => {
                if (!kopyaDrag) return
                e.preventDefault()
                e.stopPropagation()
                gorevCogalt(i)
              }}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(i)}
              style={{ display:'flex', flexDirection:'column', gap:6, animationDelay:`${i * 0.05}s`, animationFillMode:'both', minWidth: isMobile ? '120px' : 'auto', padding: isDragOver || kopyaDrag ? '8px 4px' : '0', cursor: kopyaDrag ? 'copy' : 'default' }}
            >
              {/* Gün başlığı */}
              <div style={{ padding:'8px 6px', borderRadius:10, background: isBugun?`linear-gradient(135deg, ${tema.primary}, ${tema.primaryLight})`:tema.card, border: isBugun?'none':`1px solid ${tema.border}`, textAlign:'center', marginBottom:2 }}>
                <p style={{ margin:0, fontSize:11, fontWeight:600, color: isBugun?tema.onPrimary:tema.muted, letterSpacing:0.5 }}>{gunBilgisi.label}</p>
                {gunGorevler.length > 0 && (
                  <p style={{ margin:'3px 0 0', fontSize:10, color: isBugun?tema.onPrimary: tamam===gunGorevler.length?tema.primaryLight:tema.faint, fontWeight: isBugun ? 500 : 400 }}>{tamam}/{gunGorevler.length}</p>
                )}
              </div>

              {/* Toplam çalışma süresi */}
              {gunToplamSure > 0 && (
                <div style={{ padding:'6px 8px', borderRadius:8, background:`${tema.primary}15`, border:`1px solid ${tema.primary}30`, textAlign:'center' }}>
                  <p style={{ margin:0, fontSize:10, color:tema.primaryLight, fontWeight:600 }}>⏱ {formatSure(gunToplamSure)}</p>
                </div>
              )}

              {/* Görevler */}
              {gunGorevler.map(g => {
                const renk = getDersRengi(g.ders, tema.mode)
                const gs = g.gercek_sure || 0
                const isDragging = draggingTask?.id === g.id
                return (
                  <div
                    key={g.id}
                    className={`gorev-card ${isDragging ? 'dragging' : ''}`}
                    draggable={!g.tamam}
                    onDragStart={() => handleDragStart(g)}
                    onDragEnd={handleDragEnd}
                    style={{ padding:'10px 8px 9px', border:`1px solid ${tema.border}`, borderRadius:10, background: g.tamam ? tema.cardSoft : tema.card, opacity: g.tamam?0.5:(isDragging?0.5:1), position:'relative', overflow:'hidden', cursor: g.tamam ? 'default' : 'grab' }}
                  >
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:renk, borderRadius:'3px 0 0 3px' }} />
                    <div style={{ paddingLeft:10 }}>
                      <p onClick={() => { if (!g.tamam) detayAc(g) }} style={{ margin:'0 0 2px', fontSize:10, color:renk, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', cursor:'pointer' }}>{g.ders}</p>
                      <p onClick={() => { if (!g.tamam) detayAc(g) }} style={{ margin:'0 0 6px', fontSize:11, color: g.tamam?tema.faint:tema.text, textDecoration: g.tamam?'line-through':'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4, fontWeight: g.tamam ? 400 : 500, cursor:'pointer' }}>{g.konu}</p>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:10, color:tema.faint, fontWeight:500 }}>{gs > 0 ? `${gs}dk` : '—'}</span>
                        <div style={{ display:'flex', gap:4 }}>
                          <button onClick={() => tickla(g)} className="btn-hover" style={{ width:18, height:18, borderRadius:5, border: g.tamam?'none':`2px solid ${tema.border}`, background: g.tamam?renk:'transparent', cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {g.tamam && <svg width="10" height="8" viewBox="0 0 10 7"><path d="M1.5 3.5L3.5 5.5L8.5 1.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
                          </button>
                          <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }} onClick={(e) => kopyaBaslat(g, e)} draggable={false} className="btn-hover" title="çoğalt" aria-label="görevi çoğalt" style={{ background:'none', border:'none', color:tema.faint, cursor:'copy', fontSize:13, lineHeight:1, padding:0, display:'flex', alignItems:'center', fontWeight:500 }}>⧉</button>
                          <button onClick={() => sil(g.id)} className="btn-hover" style={{ background:'none', border:'none', color:tema.faint, cursor:'pointer', fontSize:16, lineHeight:1, padding:0, display:'flex', alignItems:'center', fontWeight:300 }}>×</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Görev ekleme formu - BÜYÜTÜLDÜ */}
              {formAcik ? (
                <div className="slide-in" style={{ padding:'14px 12px', border:`1px solid ${tema.border}`, borderRadius:12, background:tema.cardSoft, display:'flex', flexDirection:'column', gap:10 }}>
                  <input autoFocus value={formKonu} onChange={e => setFormKonu(e.target.value)} onKeyDown={e => { if(e.key==='Enter') ekle(); if(e.key==='Escape') setEkleGun(null); }} placeholder="ne çalışacaksın?..."
                    style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.text, fontSize:15, padding:'14px 14px', outline:'none', width:'100%', boxSizing:'border-box' }} />
                  <select value={formDers} onChange={e => setFormDers(e.target.value)} style={{ fontSize:13, padding:'12px 12px', background:tema.card, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, width:'100%', boxSizing:'border-box', appearance:'none', WebkitAppearance:'none' }}>
                    {DERSLER.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setEkleGun(null)} className="btn-hover" style={{ flex:1, fontSize:13, padding:'12px 0', background:tema.card, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.faint, cursor:'pointer' }}>iptal</button>
                    <button onClick={ekle} className="btn-hover" style={{ flex:1, fontSize:13, padding:'12px 0', background:tema.primary, border:'none', borderRadius:10, color:tema.onPrimary, fontWeight:600, cursor:'pointer' }}>ekle</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setEkleGun(i); setFormKonu(''); }} className="btn-hover" style={{ width:'100%', padding:'14px 0', fontSize:20, cursor: kopyaDrag ? 'copy' : 'pointer', border:`2px dashed ${tema.border}`, borderRadius:12, background:'transparent', color:tema.faint, fontWeight:300 }}>+</button>
              )}
            </div>
          )
        })}
      </div>

      {/* İşlem bildirimi */}
      {kopyaDrag && (
        <>
          <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:3000, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted, padding:'8px 14px', borderRadius:10, fontSize:11, boxShadow:tema.hoverShadow, pointerEvents:'none' }}>
            Kopyalamak için hedef güne tıkla · esc iptal
          </div>
          <div style={{ position:'fixed', left:kopyaKonum.x, top:kopyaKonum.y, transform:'translate(-50%, -50%)', zIndex:3000, width:160, padding:'10px 8px 9px', border:`1px solid ${tema.primary}`, borderRadius:10, background:tema.card, boxShadow:tema.shadow, pointerEvents:'none', opacity:0.92 }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:getDersRengi(kopyaDrag.ders, tema.mode), borderRadius:'3px 0 0 3px' }} />
            <div style={{ paddingLeft:10 }}>
              <p style={{ margin:'0 0 2px', fontSize:10, color:getDersRengi(kopyaDrag.ders, tema.mode), fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{kopyaDrag.ders}</p>
              <p style={{ margin:'0 0 6px', fontSize:11, color:tema.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4, fontWeight:500 }}>{kopyaDrag.konu}</p>
              <span style={{ fontSize:10, color:tema.faint, fontWeight:500 }}>kopya</span>
            </div>
          </div>
        </>
      )}
      {bildirim && (
        <div className="slide-up" style={{ position:'fixed', bottom:30, left:'50%', transform:'translateX(-50%)', background:tema.success, color:tema.successText, padding:'12px 24px', borderRadius:12, boxShadow:tema.hoverShadow, zIndex:3000, fontWeight:600, fontSize:14 }}>
          {bildirim}
        </div>
      )}
    </div>
  )
}
