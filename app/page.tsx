'use client'

import { useState, useEffect, useCallback, useRef, type CSSProperties } from 'react'
import {
  Apple,
  Archive,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Image as ImageIcon,
  ListPlus,
  LogIn,
  LogOut,
  Moon,
  MousePointer2,
  MoveRight,
  NotebookPen,
  Palette,
  Plus,
  Save,
  Settings,
  Sun,
  Trash2,
  Type,
  X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { KAYNAK_DERS_TUMU, KAYNAK_DERSLER, KAYNAK_KATALOGU, KAYNAK_YAYINEVLERI, kaynakSirala, type KaynakKatalogItem, type SinavTuru } from '@/lib/kaynak-katalogu'
import { PALETLER, PALET_SIRASI, TEMALAR as FLAT_TEMALAR, normalizeTemaKey as normalizeFlatTemaKey, type PaletKey, type TemaMode } from '@/lib/tema-paletleri'
import type { User } from '@supabase/supabase-js'

const DERSLER = ['TYT Mat','TYT Türkçe','TYT Fen','TYT Sosyal','TYT Genel Deneme','AYT Mat','AYT Fizik','AYT Kimya','AYT Bio','AYT Edebiyat','AYT Tarih','AYT Genel Deneme']
const GUNLER = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz']

interface Gorev {
  id: string
  user_id?: string
  ders: string
  konu: string
  kaynak_id?: string | null
  kaynak_ids?: string[]
  gun: number
  hafta: string
  tamam: boolean
  gercek_sure: number
  created_at: string
}

type AyarSekmesi = 'tema' | 'font' | 'cursor' | 'kaynak' | 'hesap'
type FontKey = 'dmMono' | 'geistMono' | 'jetBrainsMono' | 'ibmPlexMono' | 'spaceGrotesk' | 'manrope'
type CursorKey = 'minimal' | 'system'
type KaynakGorunumu = 'text' | 'visual'
type KaynaklarSekmesi = 'katalog' | 'secili'
type OAuthProvider = 'google' | 'apple' | 'facebook' | 'azure'

interface GunlukNot {
  id: string
  user_id?: string
  tarih: string
  icerik: string
  created_at: string
}

type Kaynak = KaynakKatalogItem

const KAYNAK_BY_ID = new Map(KAYNAK_KATALOGU.map(kaynak => [kaynak.id, kaynak]))
const KAYNAK_ID_SET = new Set(KAYNAK_KATALOGU.map(kaynak => kaynak.id))

interface FontSecenegi {
  name: string
  tone: string
  preview: string
  family: string
}

interface CursorSecenegi {
  name: string
  tone: string
  preview: string
}

const FONTLAR: Record<FontKey, FontSecenegi> = {
  dmMono: {
    name: 'DM Mono',
    tone: 'Mevcut',
    preview: 'Haftalık Program',
    family: "var(--font-dm-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  geistMono: {
    name: 'Geist Mono',
    tone: 'Modern',
    preview: 'Bugün 45dk',
    family: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  jetBrainsMono: {
    name: 'JetBrains Mono',
    tone: 'Teknik',
    preview: 'TYT Mat 5 test',
    family: "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  ibmPlexMono: {
    name: 'IBM Plex Mono',
    tone: 'Akademik',
    preview: '27 Nis - 3 May',
    family: "var(--font-ibm-plex-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  spaceGrotesk: {
    name: 'Space Grotesk',
    tone: 'Premium',
    preview: 'Haftalık Program',
    family: "var(--font-space-grotesk), Inter, ui-sans-serif, system-ui, sans-serif"
  },
  manrope: {
    name: 'Manrope',
    tone: 'Sakin',
    preview: 'Plan hazır',
    family: "var(--font-manrope), Inter, ui-sans-serif, system-ui, sans-serif"
  },
}

const CURSORLAR: Record<CursorKey, CursorSecenegi> = {
  minimal: {
    name: 'Sade',
    tone: 'Renkli ok',
    preview: 'Tema rengine uygun düz imleç'
  },
  system: {
    name: 'Sistem',
    tone: 'Kapalı',
    preview: 'Mac imleci kullan'
  },
}

const TUTORIAL_ADIMLARI = [
  {
    target: 'tema-toggle',
    title: 'Görünümü hızlı değiştir',
    desc: 'Light ve dark görünüm arasında tek tuşla geçebilirsin. Seçtiğin paletin karşı modu korunur.',
  },
  {
    target: 'kaynaklar',
    title: 'Kaynaklarını seç',
    desc: 'Elindeki kitapları buradan işaretle. Görev eklerken sadece ilgili dersin kaynakları önerilir.',
  },
  {
    target: 'notlar',
    title: 'Not arşivin burada',
    desc: 'Günlük görünümde aldığın tüm notlar kronolojik olarak burada toplanır.',
  },
  {
    target: 'gunluk',
    title: 'Güne odaklan',
    desc: 'Gün başlığına tıklayınca o günün görevleri, notları ve hazırlık alanı ayrı bir odak panelinde açılır.',
  },
  {
    target: 'gorev-ekle',
    title: 'Görev eklemeye başla',
    desc: 'Artı alanından hızlıca görev oluşturabilir, ders ve kaynak bağlayabilirsin.',
  },
]

const normalizeTemaKey = (key: string | null) => normalizeFlatTemaKey(key)
const normalizeFontKey = (key: string | null): FontKey =>
  key && key in FONTLAR ? (key as FontKey) : 'dmMono'
const normalizeCursorKey = (key: string | null): CursorKey =>
  key === 'system' ? 'system' : 'minimal'
const normalizeKaynakGorunumu = (key: string | null): KaynakGorunumu =>
  key === 'visual' ? 'visual' : 'text'
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
  const [formKaynakIds, setFormKaynakIds] = useState<string[]>([])
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
  const [gunlukPanelIndex, setGunlukPanelIndex] = useState<number | null>(null)
  const [gunlukNotlar, setGunlukNotlar] = useState<GunlukNot[]>([])
  const [notlarAcik, setNotlarAcik] = useState(false)
  const [notInput, setNotInput] = useState('')
  const [kaynaklarAcik, setKaynaklarAcik] = useState(false)
  const [kaynaklarSekme, setKaynaklarSekme] = useState<KaynaklarSekmesi>('katalog')
  const [misafirModu, setMisafirModu] = useState(false)
  const [setupAcik, setSetupAcik] = useState(false)
  const [setupAdim, setSetupAdim] = useState(0)
  const [onboardingAcik, setOnboardingAcik] = useState(false)
  const [onboardingAdim, setOnboardingAdim] = useState(0)
  const [tutorialRect, setTutorialRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [aktifKaynakSinav, setAktifKaynakSinav] = useState<SinavTuru>('TYT')
  const [aktifKaynakDers, setAktifKaynakDers] = useState(KAYNAK_DERS_TUMU)
  const [aktifKaynakYayinevi, setAktifKaynakYayinevi] = useState('Tümü')
  const [kullaniciKaynakIds, setKullaniciKaynakIds] = useState<string[]>([])
  const [sonKaynakSecimi, setSonKaynakSecimi] = useState<Record<string, string>>({})
  const [editKonu, setEditKonu] = useState('')
  const [editDers, setEditDers] = useState('')
  const [editKaynakIds, setEditKaynakIds] = useState<string[]>([])
  const [bitmeyenAcik, setBitmeyenAcik] = useState(false)
  const [tasimaHedef, setTasimaHedef] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [ayarlarAcik, setAyarlarAcik] = useState(false)
  const [ayarSekmesi, setAyarSekmesi] = useState<AyarSekmesi>('tema')
  const [authModal, setAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [guestMigrate, setGuestMigrate] = useState(false)
  const [tercihlerYuklendi, setTercihlerYuklendi] = useState(false)
  const [aktifTema, setAktifTema] = useState('american-dark-1')
  const [aktifTemaPaleti, setAktifTemaPaleti] = useState<PaletKey | null>(null)
  const [temaSekmesi, setTemaSekmesi] = useState<TemaMode>('dark')
  const [aktifFont, setAktifFont] = useState<FontKey>('dmMono')
  const [aktifCursor, setAktifCursor] = useState<CursorKey>('minimal')
  const [kaynakGorunumu, setKaynakGorunumu] = useState<KaynakGorunumu>('text')
  const [draggingTask, setDraggingTask] = useState<Gorev | null>(null)
  const [dragOverDay, setDragOverDay] = useState<number | null>(null)
  const [bildirim, setBildirim] = useState<string | null>(null)
  const [mouseKonum, setMouseKonum] = useState({ x: 0, y: 0 })
  const [cursorHazir, setCursorHazir] = useState(false)
  const [cursorInteractive, setCursorInteractive] = useState(false)
  const [cursorKapali, setCursorKapali] = useState(false)
  const pointerDragRef = useRef<{ task: Gorev; startX: number; startY: number; active: boolean; pointerId: number } | null>(null)
  const dragClickEngelleRef = useRef(false)
  const previousUserSelectRef = useRef<string | null>(null)
  const previousHtmlUserSelectRef = useRef<string | null>(null)

  const seciliTema = FLAT_TEMALAR[aktifTema] || FLAT_TEMALAR[normalizeTemaKey(aktifTema)]
  const tema = seciliTema
  const font = FONTLAR[aktifFont]
  const sayfaArkaPlani = seciliTema.bg
  const gorunenGunler = Array.from({ length: 7 }, (_, i) => getGunBilgisi(gunOffset, i))
  const gorunenHaftalar = Array.from(new Set(gorunenGunler.map(g => g.hafta)))
  const seciliTemaListesi = aktifTemaPaleti
    ? Object.entries(FLAT_TEMALAR).filter(([, t]) => t.palette === aktifTemaPaleti && t.mode === temaSekmesi)
    : []
  const customCursorAktif = !isMobile && !cursorKapali && aktifCursor !== 'system'
  const cursorMode = kopyaDrag ? 'copy' : draggingTask ? 'drag' : dragOverDay !== null ? 'target' : cursorInteractive ? 'hover' : 'normal'
  const iconProps = { size: 14, strokeWidth: 2.1 }
  const oauthProviders: { provider: OAuthProvider; label: string; color: string }[] = [
    { provider: 'google', label: 'Google', color: '#4285f4' },
    { provider: 'apple', label: 'Apple', color: tema.textStrong },
    { provider: 'facebook', label: 'Facebook', color: '#1877f2' },
    { provider: 'azure', label: 'Microsoft', color: '#7c3aed' },
  ]
  const iconButtonStyle: CSSProperties = {
    background: tema.card,
    border: `1px solid ${tema.border}`,
    borderRadius: 9,
    color: tema.muted,
    cursor: 'pointer',
    width: 34,
    height: 34,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
  const compactActionStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    fontSize: 11,
    padding: '8px 15px',
    borderRadius: 9,
    cursor: 'pointer',
    fontWeight: 600,
    letterSpacing: 0
  }
  const modalActionStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: 14,
    padding: '14px 0',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 600
  }

  const bildir = (mesaj: string) => {
    setBildirim(mesaj)
    setTimeout(() => setBildirim(null), 1500)
  }

  const parseJson = <T,>(value: string | null, fallback: T): T => {
    if (!value) return fallback
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }

  const closeOnBackdrop = (event: React.MouseEvent<HTMLDivElement>, close: () => void) => {
    if (event.target === event.currentTarget) close()
  }

  const getGorevKaynakIds = (gorev: Partial<Gorev>) => {
    const ids = Array.isArray(gorev.kaynak_ids) ? [...gorev.kaynak_ids] : []
    if (gorev.kaynak_id && !ids.includes(gorev.kaynak_id)) ids.push(gorev.kaynak_id)
    return Array.from(new Set(ids.filter(id => KAYNAK_ID_SET.has(id))))
  }

  const normalizeGorevKaynakIds = (gorev: Gorev): Gorev => ({
    ...gorev,
    kaynak_ids: getGorevKaynakIds(gorev),
  })

  const isPasswordStrong = (password: string) =>
    password.length >= 8 &&
    /[a-zçğıöşü]/.test(password) &&
    /[A-ZÇĞİÖŞÜ]/.test(password) &&
    /\d/.test(password)

  const handleRootClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!kopyaDrag) return
    const target = event.target as HTMLElement
    if (!target.closest('.day-column')) {
      setKopyaDrag(null)
      setDragOverDay(null)
    }
  }

  const updatePointerKonum = useCallback((x: number, y: number) => {
    if (x === 0 && y === 0) return
    setMouseKonum({ x, y })
    setCursorHazir(true)
  }, [])

  const setDragSelectionLock = useCallback((locked: boolean) => {
    if (locked) {
      if (previousUserSelectRef.current === null) {
        previousUserSelectRef.current = document.body.style.userSelect
        previousHtmlUserSelectRef.current = document.documentElement.style.userSelect
      }
      document.documentElement.classList.add('task-drag-lock')
      document.body.style.userSelect = 'none'
      document.documentElement.style.userSelect = 'none'
      document.getSelection()?.removeAllRanges()
      return
    }

    if (previousUserSelectRef.current !== null) {
      document.documentElement.classList.remove('task-drag-lock')
      document.body.style.userSelect = previousUserSelectRef.current
      document.documentElement.style.userSelect = previousHtmlUserSelectRef.current ?? ''
      previousUserSelectRef.current = null
      previousHtmlUserSelectRef.current = null
    }
  }, [])

  const engelleSiradakiClick = () => {
    dragClickEngelleRef.current = true
    window.setTimeout(() => {
      dragClickEngelleRef.current = false
    }, 0)
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

  const getVarsayilanKaynakIds = (ders: string) => {
    const uygunKaynaklar = KAYNAK_KATALOGU.filter(kaynak => kaynak.ders === ders && kullaniciKaynakIds.includes(kaynak.id))
    const sonSecim = sonKaynakSecimi[ders]
    return sonSecim && uygunKaynaklar.some(kaynak => kaynak.id === sonSecim) ? [sonSecim] : []
  }

  const formDersDegistir = (ders: string) => {
    setFormDers(ders)
    setFormKaynakIds(getVarsayilanKaynakIds(ders))
  }

  const kaynakSinavDegistir = (sinav: SinavTuru) => {
    setAktifKaynakSinav(sinav)
    setAktifKaynakDers(KAYNAK_DERS_TUMU)
    setAktifKaynakYayinevi('Tümü')
  }

  const saveGuestKaynakTercihleri = (ids: string[], sonSecimler = sonKaynakSecimi) => {
    localStorage.setItem('yks-kullanici-kaynaklari', JSON.stringify(ids))
    localStorage.setItem('yks-son-kaynak-secimi', JSON.stringify(sonSecimler))
  }

  const syncUserKaynakTercihleri = async (tamamlandi?: boolean, sonSecimler = sonKaynakSecimi) => {
    if (!user) return
    const payload: {
      user_id: string
      onboarding_tamamlandi?: boolean
      son_kaynak_secimi: Record<string, string>
      updated_at: string
    } = {
      user_id: user.id,
      son_kaynak_secimi: sonSecimler,
      updated_at: new Date().toISOString()
    }
    if (typeof tamamlandi === 'boolean') payload.onboarding_tamamlandi = tamamlandi

    const { error } = await supabase
      .from('kullanici_tercihleri')
      .upsert(payload, { onConflict: 'user_id' })
    if (error) console.warn('Kaynak tercihleri kaydedilemedi:', error.message)
  }

  const loadKaynakTercihleri = async (currentUser: User | null) => {
    if (!currentUser) {
      setKullaniciKaynakIds(parseJson<string[]>(localStorage.getItem('yks-kullanici-kaynaklari'), []))
      setSonKaynakSecimi(parseJson<Record<string, string>>(localStorage.getItem('yks-son-kaynak-secimi'), {}))
      setSetupAcik(false)
      setOnboardingAcik(false)
      return
    }

    const { data: kaynakData, error: kaynakError } = await supabase
      .from('kullanici_kaynaklari')
      .select('kaynak_id')
      .eq('user_id', currentUser.id)

    if (kaynakError) {
      console.warn('Kullanıcı kaynakları yüklenemedi:', kaynakError.message)
      setKullaniciKaynakIds(parseJson<string[]>(localStorage.getItem('yks-kullanici-kaynaklari'), []))
    } else {
      setKullaniciKaynakIds((kaynakData || []).map(kaynak => kaynak.kaynak_id as string))
    }

    const { data: tercihData, error: tercihError } = await supabase
      .from('kullanici_tercihleri')
      .select('onboarding_tamamlandi, son_kaynak_secimi')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (tercihError) {
      console.warn('Kullanıcı tercihleri yüklenemedi:', tercihError.message)
      setSonKaynakSecimi(parseJson<Record<string, string>>(localStorage.getItem('yks-son-kaynak-secimi'), {}))
      setSetupAcik(localStorage.getItem('yks-onboarding-tamam') !== '1')
      setOnboardingAcik(false)
      return
    }

    setSonKaynakSecimi((tercihData?.son_kaynak_secimi as Record<string, string> | null) || {})
    setSetupAcik(!(tercihData?.onboarding_tamamlandi))
    setOnboardingAcik(false)
  }

  const onboardingKapat = async () => {
    setOnboardingAcik(false)
    localStorage.setItem('yks-onboarding-tamam', '1')
    await syncUserKaynakTercihleri(true)
  }

  const tutorialBaslat = () => {
    setOnboardingAdim(0)
    setOnboardingAcik(true)
  }

  const setupTamamla = async () => {
    setSetupAcik(false)
    tutorialBaslat()
    await syncUserKaynakTercihleri(true)
  }

  const misafirGir = async () => {
    setMisafirModu(true)
    await loadKaynakTercihleri(null)
    loadGorevler(null)
    loadGunlukNotlar(null)
    tutorialBaslat()
  }

  const kaynakSecimiDegistir = async (kaynakId: string) => {
    const selected = kullaniciKaynakIds.includes(kaynakId)
    const nextIds = selected ? kullaniciKaynakIds.filter(id => id !== kaynakId) : [...kullaniciKaynakIds, kaynakId]
    setKullaniciKaynakIds(nextIds)
    const kaynak = KAYNAK_KATALOGU.find(k => k.id === kaynakId)
    if (!selected && kaynak?.ders === formDers && formKaynakIds.length === 0) setFormKaynakIds([kaynakId])
    if (selected && formKaynakIds.includes(kaynakId)) setFormKaynakIds(ids => ids.filter(id => id !== kaynakId))

    if (!user) {
      saveGuestKaynakTercihleri(nextIds)
    } else if (selected) {
      const { error } = await supabase
        .from('kullanici_kaynaklari')
        .delete()
        .eq('user_id', user.id)
        .eq('kaynak_id', kaynakId)
      if (error) console.warn('Kaynak çıkarılamadı:', error.message)
    } else {
      const { error } = await supabase
        .from('kullanici_kaynaklari')
        .insert({ user_id: user.id, kaynak_id: kaynakId })
      if (error) console.warn('Kaynak eklenemedi:', error.message)
    }
  }

  const handleFormKaynakSec = async (kaynakId: string) => {
    if (!kaynakId) {
      setFormKaynakIds([])
      return
    }
    const nextIds = formKaynakIds.includes(kaynakId)
      ? formKaynakIds.filter(id => id !== kaynakId)
      : [...formKaynakIds, kaynakId]
    setFormKaynakIds(nextIds)
    const next = { ...sonKaynakSecimi, [formDers]: kaynakId }
    setSonKaynakSecimi(next)
    if (!user) saveGuestKaynakTercihleri(kullaniciKaynakIds, next)
    await syncUserKaynakTercihleri(undefined, next)
  }

  const handleEditDersDegistir = (ders: string) => {
    setEditDers(ders)
    setEditKaynakIds(ids => ids.filter(id => KAYNAK_KATALOGU.some(kaynak => kaynak.id === id && kaynak.ders === ders)))
  }

  const handleEditKaynakSec = (kaynakId: string) => {
    if (!kaynakId) {
      setEditKaynakIds([])
      return
    }
    setEditKaynakIds(ids => ids.includes(kaynakId) ? ids.filter(id => id !== kaynakId) : [...ids, kaynakId])
  }

  const loadGorevKaynaklari = async (currentUser: User, gorevIds: string[]) => {
    const map: Record<string, string[]> = {}
    if (gorevIds.length === 0) return map

    const { data, error } = await supabase
      .from('gorev_kaynaklari')
      .select('gorev_id, kaynak_id')
      .eq('user_id', currentUser.id)
      .in('gorev_id', gorevIds)

    if (error) {
      console.warn('Görev kaynakları yüklenemedi:', error.message)
      return map
    }

    ;(data || []).forEach(row => {
      const gorevId = row.gorev_id as string
      const kaynakId = row.kaynak_id as string
      map[gorevId] = [...(map[gorevId] || []), kaynakId]
    })
    return map
  }

  const syncGorevKaynaklari = async (gorevId: string, kaynakIds: string[], currentUser = user) => {
    if (!currentUser) return true
    const temizIds = Array.from(new Set(kaynakIds)).filter(Boolean)
    const { error: deleteError } = await supabase
      .from('gorev_kaynaklari')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('gorev_id', gorevId)

    if (deleteError) {
      console.warn('Görev kaynakları temizlenemedi:', deleteError.message)
      return false
    }

    if (temizIds.length === 0) return true

    const { error: insertError } = await supabase
      .from('gorev_kaynaklari')
      .insert(temizIds.map(kaynakId => ({ user_id: currentUser.id, gorev_id: gorevId, kaynak_id: kaynakId })))

    if (insertError) {
      console.warn('Görev kaynakları kaydedilemedi:', insertError.message)
      return false
    }

    return true
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
    const frame = window.requestAnimationFrame(() => {
      const storedTema = normalizeTemaKey(localStorage.getItem('yks-tema'))
      setAktifTema(storedTema)
      setTemaSekmesi(FLAT_TEMALAR[storedTema].mode)
      setAktifFont(normalizeFontKey(localStorage.getItem('yks-font')))
      setAktifCursor(normalizeCursorKey(localStorage.getItem('yks-cursor')))
      localStorage.removeItem('yks-bg-style')
      setKaynakGorunumu(normalizeKaynakGorunumu(localStorage.getItem('yks-kaynak-gorunumu')))
      setTercihlerYuklendi(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [updatePointerKonum])

  useEffect(() => {
    if (!tercihlerYuklendi) return
    localStorage.setItem('yks-tema', aktifTema)
  }, [aktifTema, tercihlerYuklendi])

  useEffect(() => {
    if (!tercihlerYuklendi) return
    localStorage.setItem('yks-font', aktifFont)
  }, [aktifFont, tercihlerYuklendi])

  useEffect(() => {
    if (!tercihlerYuklendi) return
    localStorage.setItem('yks-cursor', aktifCursor)
  }, [aktifCursor, tercihlerYuklendi])

  useEffect(() => {
    if (!tercihlerYuklendi) return
    localStorage.setItem('yks-kaynak-gorunumu', kaynakGorunumu)
  }, [kaynakGorunumu, tercihlerYuklendi])

  useEffect(() => {
    return () => setDragSelectionLock(false)
  }, [setDragSelectionLock])

  useEffect(() => {
    const selectionKilitli = () => previousUserSelectRef.current !== null

    const preventSelection = (event: Event) => {
      if (!selectionKilitli()) return
      event.preventDefault()
      document.getSelection()?.removeAllRanges()
    }

    const clearSelection = () => {
      if (!selectionKilitli()) return
      document.getSelection()?.removeAllRanges()
    }

    document.addEventListener('selectstart', preventSelection, true)
    document.addEventListener('dragstart', preventSelection, true)
    document.addEventListener('selectionchange', clearSelection)

    return () => {
      document.removeEventListener('selectstart', preventSelection, true)
      document.removeEventListener('dragstart', preventSelection, true)
      document.removeEventListener('selectionchange', clearSelection)
    }
  }, [])

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateCursorCapability = () => setCursorKapali(pointerQuery.matches || motionQuery.matches)
    const frame = window.requestAnimationFrame(updateCursorCapability)

    pointerQuery.addEventListener('change', updateCursorCapability)
    motionQuery.addEventListener('change', updateCursorCapability)

    const handleMouseMove = (event: MouseEvent) => {
      updatePointerKonum(event.clientX, event.clientY)
      const target = event.target as HTMLElement | null
      setCursorInteractive(Boolean(target?.closest('button, a, input, select, textarea, [role="button"], .gorev-card')))
    }

    const handleMouseLeave = () => setCursorHazir(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.cancelAnimationFrame(frame)
      pointerQuery.removeEventListener('change', updateCursorCapability)
      motionQuery.removeEventListener('change', updateCursorCapability)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [updatePointerKonum])

  useEffect(() => {
    let frame = 0

    if (!onboardingAcik) {
      frame = window.requestAnimationFrame(() => setTutorialRect(null))
      return () => window.cancelAnimationFrame(frame)
    }

    const updateTutorialRect = () => {
      const step = TUTORIAL_ADIMLARI[onboardingAdim]
      const target = step ? document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`) : null
      if (!target) {
        setTutorialRect(null)
        return
      }
      const rect = target.getBoundingClientRect()
      setTutorialRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
    }

    const scheduleTutorialRect = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateTutorialRect)
    }

    scheduleTutorialRect()
    window.addEventListener('resize', scheduleTutorialRect)
    window.addEventListener('scroll', scheduleTutorialRect, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleTutorialRect)
      window.removeEventListener('scroll', scheduleTutorialRect, true)
    }
  }, [onboardingAcik, onboardingAdim, gunOffset, isMobile])

  useEffect(() => {
    if (!kopyaDrag) return

    const handleMouseMove = (event: MouseEvent) => {
      updatePointerKonum(event.clientX, event.clientY)
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
  }, [kopyaDrag, updatePointerKonum])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      if (kopyaDrag) {
        setKopyaDrag(null)
        return
      }
      if (draggingTask) {
        pointerDragRef.current = null
        setDraggingTask(null)
        setDragOverDay(null)
        setDragSelectionLock(false)
        return
      }
      if (kaynaklarAcik) {
        setKaynaklarAcik(false)
        return
      }
      if (notlarAcik) {
        setNotlarAcik(false)
        return
      }
      if (ayarlarAcik) {
        setAyarlarAcik(false)
        return
      }
      if (authModal) {
        setAuthModal(false)
        setAuthError('')
        return
      }
      if (detayModal) {
        setDetayModal(null)
        return
      }
      if (sureModal) {
        setSureModal(null)
        return
      }
      if (bitmeyenAcik) {
        setBitmeyenAcik(false)
        return
      }
      if (topluAcik) {
        setTopluAcik(false)
        return
      }
      if (ekleGun !== null) {
        setEkleGun(null)
        return
      }
      if (onboardingAcik) {
        if (onboardingAdim > 0) setOnboardingAdim(adim => Math.max(0, adim - 1))
        else void onboardingKapat()
        return
      }
      if (gunlukPanelIndex !== null) {
        setGunlukPanelIndex(null)
        return
      }
      if (setupAcik && setupAdim > 0) {
        setSetupAdim(adim => Math.max(0, adim - 1))
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [kopyaDrag, draggingTask, kaynaklarAcik, notlarAcik, ayarlarAcik, authModal, detayModal, sureModal, bitmeyenAcik, topluAcik, ekleGun, onboardingAcik, onboardingAdim, gunlukPanelIndex, setupAcik, setupAdim, setDragSelectionLock])

  async function loadGorevler(currentUser: User | null) {
    if (!currentUser) {
      const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
      setGorevler(local.filter((g: Gorev) => gorunenHaftalar.includes(g.hafta)).map(normalizeGorevKaynakIds))
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('gorevler')
      .select('*')
      .in('hafta', gorunenHaftalar)
      .order('created_at')

    if (data) {
      const gorevData = data as Gorev[]
      const kaynakMap = await loadGorevKaynaklari(currentUser, gorevData.map(g => g.id))
      setGorevler(gorevData.map(g => normalizeGorevKaynakIds({
        ...g,
        kaynak_ids: kaynakMap[g.id]?.length ? kaynakMap[g.id] : getGorevKaynakIds(g)
      })))
    }
    setLoading(false)
  }

  async function loadGunlukNotlar(currentUser: User | null) {
    if (!currentUser) {
      const local = JSON.parse(localStorage.getItem('yks-gunluk-notlar') || '[]')
      setGunlukNotlar((local as GunlukNot[]).sort((a, b) => b.created_at.localeCompare(a.created_at)))
      return
    }

    const { data, error } = await supabase
      .from('gunluk_notlar')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Günlük notlar yüklenemedi:', error)
      setGunlukNotlar([])
      return
    }
    if (data) setGunlukNotlar(data as GunlukNot[])
  }

  async function migrateGuestTasks(currentUser: User) {
    const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
    if (local.length === 0 || guestMigrate) return

    setGuestMigrate(true)
    const localGorevler = (local as Gorev[]).map(normalizeGorevKaynakIds)
    const toMigrate = localGorevler.map((g: Gorev) => {
      const payload: Partial<Gorev> = { ...g, user_id: currentUser.id }
      delete payload.id
      delete payload.kaynak_ids
      payload.kaynak_id = getGorevKaynakIds(g)[0] || null
      if (!payload.kaynak_id) delete payload.kaynak_id
      return payload
    })

    if (toMigrate.length > 0) {
      const { data } = await supabase.from('gorevler').insert(toMigrate).select()
      if (data) {
        await Promise.all((data as Gorev[]).map((g, index) =>
          syncGorevKaynaklari(g.id, getGorevKaynakIds(localGorevler[index]), currentUser)
        ))
      }
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
      if (user) setMisafirModu(false)
      loadGorevler(user)
      loadGunlukNotlar(user)
      loadKaynakTercihleri(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        setMisafirModu(false)
        loadGorevler(u)
        loadGunlukNotlar(u)
        loadKaynakTercihleri(u)
        // Migrate guest tasks if needed
        migrateGuestTasks(u)
      } else {
        loadGorevler(null)
        loadGunlukNotlar(null)
        loadKaynakTercihleri(null)
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

    if (authMode === 'register' && !isPasswordStrong(authPassword)) {
      setAuthError('Şifre en az 8 karakter, büyük/küçük harf ve rakam içermeli')
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

  const handleOAuth = async (provider: OAuthProvider) => {
    setAuthLoading(true)
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window === 'undefined' ? undefined : `${window.location.origin}/`,
        scopes: provider === 'facebook' ? 'email' : undefined,
      }
    })
    if (error) {
      setAuthError(error.message)
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setGuestMigrate(false)
    setMisafirModu(false)
    setSetupAcik(false)
    setOnboardingAcik(false)
    loadGorevler(null)
  }

  const saveGuest = (newGorevler: Gorev[]) => {
    const local = JSON.parse(localStorage.getItem('yks-gorevler') || '[]')
    const otherWeeks = local.filter((g: Gorev) => !gorunenHaftalar.includes(g.hafta))
    localStorage.setItem('yks-gorevler', JSON.stringify([...otherWeeks, ...newGorevler]))
  }

  const saveGuestNotes = (notlar: GunlukNot[]) => {
    localStorage.setItem('yks-gunluk-notlar', JSON.stringify(notlar))
  }

  const kaynakKolonuEksikMi = (error: { message?: string } | null) =>
    Boolean(error?.message?.toLocaleLowerCase('tr').includes('kaynak_id'))

  const gorevInsert = async (payload: Omit<Gorev, 'id' | 'created_at'>) => {
    const dbPayload: Partial<Gorev> = { ...payload }
    delete dbPayload.kaynak_ids
    const result = await supabase.from('gorevler').insert(dbPayload).select().single()
    if (!result.error || !payload.kaynak_id || !kaynakKolonuEksikMi(result.error)) return result

    const payloadWithoutKaynak: Partial<Gorev> = { ...payload }
    delete payloadWithoutKaynak.kaynak_id
    delete payloadWithoutKaynak.kaynak_ids
    const retry = await supabase.from('gorevler').insert(payloadWithoutKaynak).select().single()
    if (!retry.error) bildir('Görev eklendi. Kaynak bağlantısı için Supabase migration onayı gerekiyor.')
    return retry
  }

  const gunlukNotEkle = async (tarih: string) => {
    if (!notInput.trim()) return
    const icerik = notInput.trim()

    if (!user) {
      const yeni: GunlukNot = { id: createGuestId(), tarih, icerik, created_at: new Date().toISOString() }
      const updated = [yeni, ...gunlukNotlar]
      setGunlukNotlar(updated)
      saveGuestNotes(updated)
    } else {
      const { data, error } = await supabase
        .from('gunluk_notlar')
        .insert({ tarih, icerik, user_id: user.id })
        .select()
        .single()

      if (error) {
        console.error('Günlük not eklenemedi:', error)
        alert('Not eklenemedi: ' + error.message)
        return
      }
      if (data) setGunlukNotlar([data as GunlukNot, ...gunlukNotlar])
    }

    setNotInput('')
    bildir('Not kaydedildi')
  }

  const gunlukNotSil = async (id: string) => {
    if (!user) {
      const updated = gunlukNotlar.filter(n => n.id !== id)
      setGunlukNotlar(updated)
      saveGuestNotes(updated)
    } else {
      const { error } = await supabase.from('gunluk_notlar').delete().eq('id', id)
      if (error) {
        console.error('Günlük not silinemedi:', error)
        alert('Not silinemedi: ' + error.message)
        return
      }
      setGunlukNotlar(gunlukNotlar.filter(n => n.id !== id))
    }
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
    const seciliKaynakIds = Array.from(new Set(formKaynakIds))
    if (seciliKaynakIds.length > 0) {
      yeniGorev.kaynak_id = seciliKaynakIds[0]
      yeniGorev.kaynak_ids = seciliKaynakIds
    }

    if (!user) {
      const yeni: Gorev = { ...yeniGorev, id: createGuestId(), created_at: new Date().toISOString() }
      const updated = [...gorevler, yeni]
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { data, error } = await gorevInsert(yeniGorev)
      if (error) {
        console.error('Supabase insert error:', error)
        alert('Görev eklenemedi: ' + error.message)
        return
      }
      if (data) {
        const kaydedildi = await syncGorevKaynaklari((data as Gorev).id, seciliKaynakIds)
        if (!kaydedildi && seciliKaynakIds.length > 1) bildir('Görev eklendi. Çoklu kaynak için Supabase migration onayı gerekiyor.')
        setGorevler([...gorevler, normalizeGorevKaynakIds({ ...(data as Gorev), kaynak_ids: seciliKaynakIds })])
      }
    }

    setFormKonu('')
    setFormKaynakIds([])
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
    const kopyaKaynakIds = getGorevKaynakIds(kopyaDrag)
    if (kopyaKaynakIds.length > 0) {
      yeniGorev.kaynak_id = kopyaKaynakIds[0]
      yeniGorev.kaynak_ids = kopyaKaynakIds
    }

    if (!user) {
      const yeni: Gorev = { ...yeniGorev, id: createGuestId(), created_at: new Date().toISOString() }
      const updated = [...gorevler, yeni]
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { data, error } = await gorevInsert(yeniGorev)
      if (error) {
        console.error('Görev çoğaltma hatası:', error)
        alert('Görev çoğaltılamadı: ' + error.message)
        return
      }
      if (data) {
        await syncGorevKaynaklari((data as Gorev).id, kopyaKaynakIds)
        setGorevler([...gorevler, normalizeGorevKaynakIds({ ...(data as Gorev), kaynak_ids: kopyaKaynakIds })])
      }
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
      await supabase.from('gorev_kaynaklari').delete().eq('user_id', user.id).eq('gorev_id', id)
      await supabase.from('gorevler').delete().eq('id', id)
      setGorevler(gorevler.filter(g => g.id !== id))
    }
  }

  const detayAc = (gorev: Gorev) => {
    setDetayModal(gorev)
    setEditKonu(gorev.konu)
    setEditDers(gorev.ders)
    setEditKaynakIds(getGorevKaynakIds(gorev))
  }

  const detayKaydet = async () => {
    if (!detayModal || !editKonu.trim()) return

    const uygunEditKaynakIds = editKaynakIds.filter(id => KAYNAK_KATALOGU.some(kaynak => kaynak.id === id && kaynak.ders === editDers))
    const updatedData: { konu: string; ders: string; kaynak_id?: string | null; kaynak_ids?: string[] } = {
      konu: editKonu.trim(),
      ders: editDers,
      kaynak_id: uygunEditKaynakIds[0] || null,
      kaynak_ids: uygunEditKaynakIds
    }

    if (!user) {
      const updated = gorevler.map(g =>
        g.id === detayModal.id ? normalizeGorevKaynakIds({ ...g, ...updatedData }) : g
      )
      setGorevler(updated)
      saveGuest(updated)
    } else {
      await supabase.from('gorevler').update({ konu: updatedData.konu, ders: updatedData.ders, kaynak_id: updatedData.kaynak_id }).eq('id', detayModal.id)
      await syncGorevKaynaklari(detayModal.id, uygunEditKaynakIds)
      setGorevler(gorevler.map(g =>
        g.id === detayModal.id ? normalizeGorevKaynakIds({ ...g, ...updatedData }) : g
      ))
    }

    setDetayModal(null)
  }

  const toggleGun = (i: number) => {
    setSeciliGunler(gs => gs.includes(i) ? gs.filter(x => x !== i) : [...gs, i])
  }

  const getPointerGunIndex = (x: number, y: number) => {
    const element = document.elementFromPoint(x, y) as HTMLElement | null
    const column = element?.closest<HTMLElement>('.day-column')
    const index = column?.dataset.gunIndex
    return index === undefined ? null : Number(index)
  }

  const moveTaskToDay = async (task: Gorev, targetGun: number) => {
    const hedefGun = gorunenGunler[targetGun]
    if (!hedefGun) return
    
    if (task.gun === hedefGun.gun && task.hafta === hedefGun.hafta) {
      setDraggingTask(null)
      setDragOverDay(null)
      return
    }

    const updatedTask = { ...task, gun: hedefGun.gun, hafta: hedefGun.hafta }

    if (!user) {
      const updated = gorevler.map(g => g.id === task.id ? updatedTask : g)
      setGorevler(updated)
      saveGuest(updated)
    } else {
      const { error } = await supabase
        .from('gorevler')
        .update({ gun: hedefGun.gun, hafta: hedefGun.hafta })
        .eq('id', task.id)
      
      if (error) {
        console.error('Task move error:', error)
        alert('Görev taşınamadı: ' + error.message)
        setDraggingTask(null)
        setDragOverDay(null)
        return
      }
      setGorevler(gorevler.map(g => g.id === task.id ? updatedTask : g))
    }

    bildir(`Görev ${hedefGun.label} gününe taşındı`)

    setDraggingTask(null)
    setDragOverDay(null)
  }

  const handlePointerDragStart = (e: React.PointerEvent<HTMLDivElement>, gorev: Gorev) => {
    if (gorev.tamam || e.pointerType !== 'mouse') return
    const target = e.target as HTMLElement
    if (target.closest('button, input, select, textarea')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragSelectionLock(true)
    pointerDragRef.current = { task: gorev, startX: e.clientX, startY: e.clientY, active: false, pointerId: e.pointerId }
    updatePointerKonum(e.clientX, e.clientY)
  }

  const handlePointerDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = pointerDragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return

    updatePointerKonum(e.clientX, e.clientY)
    const mesafe = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY)
    if (!drag.active && mesafe > 5) {
      drag.active = true
      setKopyaDrag(null)
      setDraggingTask(drag.task)
    }

    if (drag.active) {
      e.preventDefault()
      setDragOverDay(getPointerGunIndex(e.clientX, e.clientY))
    }
  }

  const handlePointerDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = pointerDragRef.current
    if (!drag || drag.pointerId !== e.pointerId) return

    pointerDragRef.current = null
    if (!drag.active) {
      setDragSelectionLock(false)
      return
    }

    e.preventDefault()
    engelleSiradakiClick()
    setDragSelectionLock(false)
    const targetGun = getPointerGunIndex(e.clientX, e.clientY)
    if (targetGun === null) {
      setDraggingTask(null)
      setDragOverDay(null)
      return
    }
    void moveTaskToDay(drag.task, targetGun)
  }

  const handlePointerDragCancel = () => {
    pointerDragRef.current = null
    setDragSelectionLock(false)
    setDraggingTask(null)
    setDragOverDay(null)
  }

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:sayfaArkaPlani }}>
        <p style={{ color:tema.faint, fontSize:12, fontFamily:font.family }}>yükleniyor...</p>
      </div>
    )
  }

  if (!user && !misafirModu) {
    return (
      <div className={customCursorAktif ? 'custom-cursor-root' : undefined} style={{ minHeight:'100vh', background:sayfaArkaPlani, color:tema.text, fontFamily:font.family, display:'flex', alignItems:'center', justifyContent:'center', padding:isMobile ? '1rem' : '2rem' }}>
        <div style={{ width:'100%', maxWidth:430, background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, boxShadow:tema.shadow, padding:isMobile ? '26px 20px' : '34px 36px' }}>
          <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase', fontWeight:800 }}>YKS Planner Pro</p>
          <h1 style={{ margin:'8px 0 8px', fontSize:isMobile ? 24 : 28, color:tema.textStrong, fontWeight:800, letterSpacing:0 }}>Planına giriş yap</h1>
          <p style={{ margin:'0 0 22px', fontSize:13, color:tema.muted, lineHeight:1.6 }}>Görevlerini, kaynaklarını ve notlarını kaybetmemek için hesapla devam et. Sadece bakmak istersen misafir olarak girebilirsin.</p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, padding:4, marginBottom:16, background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12 }}>
            {(['login', 'register'] as const).map(mode => (
              <button key={mode} onClick={() => { setAuthMode(mode); setAuthError('') }} className="btn-hover" style={{ padding:'10px 0', border:'none', borderRadius:8, background:authMode === mode ? tema.primary : 'transparent', color:authMode === mode ? tema.onPrimary : tema.muted, cursor:'pointer', fontSize:12, fontWeight:700 }}>
                {mode === 'login' ? 'Giriş' : 'Kayıt'}
              </button>
            ))}
          </div>

          {authError && (
            <div style={{ marginBottom:14, padding:'10px 12px', background:'#7f1d1d30', border:'1px solid #7f1d1d', borderRadius:10, fontSize:12, color:'#fca5a5' }}>
              {authError}
            </div>
          )}

          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="email" type="email" style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:14, padding:'13px 14px', outline:'none', marginBottom:10, boxSizing:'border-box' }} />
          <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="şifre (min 8, harf + rakam)" type="password" onKeyDown={e => { if(e.key==='Enter') handleAuth(); }} style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:14, padding:'13px 14px', outline:'none', boxSizing:'border-box' }} />
          {authMode === 'register' && (
            <p style={{ margin:'8px 0 0', fontSize:10, color:tema.faint, lineHeight:1.45 }}>En az 8 karakter, büyük/küçük harf ve rakam içermeli.</p>
          )}

          <button onClick={handleAuth} disabled={authLoading} className="btn-hover" style={{ width:'100%', marginTop:14, padding:'14px 0', background:tema.primary, border:'none', borderRadius:12, color:tema.onPrimary, fontWeight:800, fontSize:14, cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.6 : 1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {authMode === 'login' ? <LogIn {...iconProps} /> : <Plus {...iconProps} />}{authLoading ? 'bekle...' : authMode === 'login' ? 'giriş yap' : 'kayıt ol'}
          </button>

          {renderOAuthSecenekleri()}

          <button onClick={misafirGir} className="btn-hover" style={{ width:'100%', marginTop:10, padding:'13px 0', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.muted, fontWeight:700, fontSize:13, cursor:'pointer' }}>
            misafir olarak bak
          </button>
        </div>
      </div>
    )
  }

  const aktifGorevler = gorevler.filter(g => gorunenGunler.some(gun => gun.hafta === g.hafta && gun.gun === g.gun))
  const toplamTamam = aktifGorevler.filter(g => g.tamam).length
  const yuzde = aktifGorevler.length ? Math.round((toplamTamam / aktifGorevler.length) * 100) : 0
  const bitmeyenSayisi = aktifGorevler.filter(g => !g.tamam).length
  const kalanGorev = aktifGorevler.length - toplamTamam
  const tamamlananSureler = aktifGorevler.filter(g => g.tamam && (g.gercek_sure || 0) > 0).map(g => g.gercek_sure || 0)
  const toplamCalismaSure = tamamlananSureler.reduce((toplam, sure) => toplam + sure, 0)
  const ortalamaSure = tamamlananSureler.length ? Math.round(toplamCalismaSure / tamamlananSureler.length) : 0
  const tasimaHedefGun = gorunenGunler[tasimaHedef]
  const tasinabilirSayisi = aktifGorevler.filter(g =>
    !g.tamam && tasimaHedefGun && !(g.hafta === tasimaHedefGun.hafta && g.gun === tasimaHedefGun.gun)
  ).length

  const getGunToplamSure = (gunIdx: number) => {
    const hedefGun = gorunenGunler[gunIdx]
    const gunGorevler = aktifGorevler.filter(g => g.hafta === hedefGun.hafta && g.gun === hedefGun.gun && g.tamam)
    return gunGorevler.reduce((toplam, g) => toplam + (g.gercek_sure || 0), 0)
  }

  const seciliGun = gunlukPanelIndex === null ? null : gorunenGunler[gunlukPanelIndex]
  const seciliGunTarihId = seciliGun ? tarihId(seciliGun.tarih) : ''
  const seciliGunGorevleri = seciliGun
    ? aktifGorevler.filter(g => g.hafta === seciliGun.hafta && g.gun === seciliGun.gun)
    : []
  const seciliGunTamam = seciliGunGorevleri.filter(g => g.tamam).length
  const seciliGunYuzde = seciliGunGorevleri.length ? Math.round((seciliGunTamam / seciliGunGorevleri.length) * 100) : 0
  const seciliGunSure = seciliGunGorevleri.filter(g => g.tamam).reduce((toplam, g) => toplam + (g.gercek_sure || 0), 0)
  const seciliGunNotlari = seciliGunTarihId ? gunlukNotlar.filter(n => n.tarih === seciliGunTarihId) : []
  const kullaniciKaynakIdSet = new Set(kullaniciKaynakIds)
  const kullaniciKaynaklari = KAYNAK_KATALOGU.filter(kaynak => kullaniciKaynakIdSet.has(kaynak.id)).sort(kaynakSirala)
  const formKaynaklari = kullaniciKaynaklari.filter(kaynak => kaynak.ders === formDers).sort(kaynakSirala)
  const editKaynaklari = kullaniciKaynaklari.filter(kaynak => kaynak.ders === editDers).sort(kaynakSirala)
  const filtreDersleri = [KAYNAK_DERS_TUMU, ...KAYNAK_DERSLER.filter(ders => KAYNAK_KATALOGU.some(kaynak => kaynak.sinav === aktifKaynakSinav && kaynak.ders === ders))]
  const filtreYayinevleri = ['Tümü', ...KAYNAK_YAYINEVLERI.filter(yayinevi => KAYNAK_KATALOGU.some(kaynak => kaynak.sinav === aktifKaynakSinav && kaynak.yayinevi === yayinevi))]
  const katalogFiltreli = KAYNAK_KATALOGU.filter(kaynak =>
    kaynak.sinav === aktifKaynakSinav &&
    (aktifKaynakDers === KAYNAK_DERS_TUMU || kaynak.ders === aktifKaynakDers) &&
    (aktifKaynakYayinevi === 'Tümü' || kaynak.yayinevi === aktifKaynakYayinevi)
  ).sort(kaynakSirala)
  const kaynakModalListesi = kaynaklarSekme === 'secili' ? kullaniciKaynaklari : katalogFiltreli
  const kaynaklariGetir = (tasks: Gorev[]) => {
    const kaynakIds = Array.from(new Set(tasks.flatMap(getGorevKaynakIds)))
    return kaynakIds
      .map(id => KAYNAK_BY_ID.get(id))
      .filter((kaynak): kaynak is Kaynak => Boolean(kaynak))
      .sort(kaynakSirala)
  }
  const seciliGunKaynaklari = kaynaklariGetir(seciliGunGorevleri)
  const formatGunTarihi = (date: Date) =>
    date.toLocaleDateString('tr', { day: 'numeric', month: 'long', weekday: 'long' })
  const gunlukOnceki = () => {
    if (gunlukPanelIndex === null) return
    if (gunlukPanelIndex > 0) {
      setGunlukPanelIndex(gunlukPanelIndex - 1)
    } else {
      setGunOffset(o => o - 1)
    }
  }
  const gunlukSonraki = () => {
    if (gunlukPanelIndex === null) return
    if (gunlukPanelIndex < 6) {
      setGunlukPanelIndex(gunlukPanelIndex + 1)
    } else {
      setGunOffset(o => o + 1)
    }
  }

  const renderKaynakSecici = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
        <p style={{ margin:0, fontSize:10, color:tema.faint, fontWeight:700 }}>Kaynak</p>
        <button type="button" onClick={() => setKaynaklarAcik(true)} style={{ background:'none', border:'none', color:tema.primaryLight, cursor:'pointer', fontSize:10, fontWeight:700, padding:0 }}>Kaynaklarım</button>
      </div>
      {formKaynaklari.length === 0 ? (
        <button type="button" onClick={() => setKaynaklarAcik(true)} className="btn-hover" style={{ padding:'10px 11px', border:`1px dashed ${tema.border}`, borderRadius:10, background:tema.card, color:tema.faint, fontSize:11, textAlign:'left', cursor:'pointer' }}>
          Bu ders için kaynak seçilmemiş.
        </button>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto', paddingRight:2 }}>
          <button type="button" onClick={() => setFormKaynakIds([])} className="btn-hover" style={{ minHeight:48, padding:'9px 10px', border:`1px solid ${formKaynakIds.length === 0 ? tema.primary : tema.border}`, borderRadius:10, background:tema.card, color:formKaynakIds.length === 0 ? tema.primaryLight : tema.faint, cursor:'pointer', fontSize:11, fontWeight:700, textAlign:'left' }}>
            Kaynaksız
          </button>
          {formKaynaklari.map(kaynak => {
            const active = formKaynakIds.includes(kaynak.id)
            return (
              <button key={kaynak.id} type="button" onClick={() => handleFormKaynakSec(kaynak.id)} className="btn-hover" style={{ display:'flex', gap:9, alignItems:'center', minHeight:58, padding:'7px 9px', border:`1px solid ${active ? tema.primary : tema.border}`, borderRadius:10, background:active ? `${tema.primary}12` : tema.card, color:tema.text, cursor:'pointer', textAlign:'left', overflow:'hidden' }}>
                <span style={{ width:30, height:40, borderRadius:6, border:`1px solid ${tema.border}`, flex:'0 0 auto', overflow:'hidden', background:tema.cardSoft }}>
                  <img src={kaynak.kapak_url} alt="" loading="lazy" decoding="async" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </span>
                <span style={{ minWidth:0, flex:1 }}>
                  <span style={{ display:'block', fontSize:11, color:active ? tema.primaryLight : tema.text, fontWeight:800, lineHeight:1.35 }}>{kaynak.ad}</span>
                  <span style={{ display:'block', marginTop:3, fontSize:9, color:tema.faint, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{kaynak.yayinevi}</span>
                </span>
                {active && <Check size={13} strokeWidth={2.4} color={tema.primaryLight} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderDetayKaynakSecici = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
        <p style={{ margin:0, fontSize:12, color:tema.muted, fontWeight:500 }}>Kaynaklar</p>
        <button type="button" onClick={() => setKaynaklarAcik(true)} style={{ background:'none', border:'none', color:tema.primaryLight, cursor:'pointer', fontSize:10, fontWeight:700, padding:0 }}>Kaynaklarım</button>
      </div>
      {editKaynaklari.length === 0 ? (
        <button type="button" onClick={() => setKaynaklarAcik(true)} className="btn-hover" style={{ padding:'10px 11px', border:`1px dashed ${tema.border}`, borderRadius:10, background:tema.cardSoft, color:tema.faint, fontSize:11, textAlign:'left', cursor:'pointer' }}>
          Bu ders için kaynak seçilmemiş.
        </button>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto', paddingRight:2 }}>
          <button type="button" onClick={() => handleEditKaynakSec('')} className="btn-hover" style={{ minHeight:48, padding:'9px 10px', border:`1px solid ${editKaynakIds.length === 0 ? tema.primary : tema.border}`, borderRadius:10, background:tema.cardSoft, color:editKaynakIds.length === 0 ? tema.primaryLight : tema.faint, cursor:'pointer', fontSize:11, fontWeight:700, textAlign:'left' }}>
            Kaynaksız
          </button>
          {editKaynaklari.map(kaynak => {
            const active = editKaynakIds.includes(kaynak.id)
            return (
              <button key={kaynak.id} type="button" onClick={() => handleEditKaynakSec(kaynak.id)} className="btn-hover" style={{ display:'flex', gap:9, alignItems:'center', minHeight:58, padding:'7px 9px', border:`1px solid ${active ? tema.primary : tema.border}`, borderRadius:10, background:active ? `${tema.primary}12` : tema.cardSoft, color:tema.text, cursor:'pointer', textAlign:'left', overflow:'hidden' }}>
                <span style={{ width:30, height:40, borderRadius:6, border:`1px solid ${tema.border}`, flex:'0 0 auto', overflow:'hidden', background:tema.card }}>
                  <img src={kaynak.kapak_url} alt="" loading="lazy" decoding="async" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                </span>
                <span style={{ minWidth:0, flex:1 }}>
                  <span style={{ display:'block', fontSize:11, color:active ? tema.primaryLight : tema.text, fontWeight:800, lineHeight:1.35 }}>{kaynak.ad}</span>
                  <span style={{ display:'block', marginTop:3, fontSize:9, color:tema.faint, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{kaynak.yayinevi}</span>
                </span>
                {active && <Check size={13} strokeWidth={2.4} color={tema.primaryLight} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderKaynakKapak = (kaynak: Kaynak, aspectRatio = '3 / 4') => (
    <div style={{ aspectRatio, background:tema.card, borderBottom:`1px solid ${tema.border}`, overflow:'hidden' }}>
      <img
        src={kaynak.kapak_url}
        alt={kaynak.ad}
        loading="lazy"
        decoding="async"
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
      />
    </div>
  )

  const renderOAuthIcon = (provider: OAuthProvider, color: string) => {
    const badgeStyle: CSSProperties = {
      width:20,
      height:20,
      borderRadius:6,
      background:tema.card,
      border:`1px solid ${tema.border}`,
      display:'inline-flex',
      alignItems:'center',
      justifyContent:'center',
      color,
      fontSize:12,
      fontWeight:900,
      lineHeight:1,
      flex:'0 0 auto'
    }

    if (provider === 'apple') return <span style={badgeStyle}><Apple size={13} strokeWidth={2.1} /></span>
    if (provider === 'azure') return <span style={badgeStyle}><Building2 size={13} strokeWidth={2.1} /></span>
    return <span style={badgeStyle}>{provider === 'facebook' ? 'f' : 'G'}</span>
  }

  function renderOAuthSecenekleri() {
    return (
    <div style={{ marginTop:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, margin:'2px 0 12px' }}>
        <span style={{ height:1, background:tema.border, flex:1 }} />
        <span style={{ fontSize:10, color:tema.faint, fontWeight:700 }}>veya</span>
        <span style={{ height:1, background:tema.border, flex:1 }} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:8 }}>
        {oauthProviders.map(({ provider, label, color }) => (
          <button key={provider} onClick={() => handleOAuth(provider)} disabled={authLoading} className="btn-hover" style={{ minHeight:42, padding:'10px 8px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.text, cursor:authLoading ? 'not-allowed' : 'pointer', opacity:authLoading ? 0.65 : 1, fontSize:12, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7 }}>
            {renderOAuthIcon(provider, color)} {label}
          </button>
        ))}
      </div>
    </div>
    )
  }

  if (user && setupAcik) {
    const setupBasliklari = ['Tema', 'Kaynak', 'Tercih', 'Bitir']

    return (
      <div style={{ minHeight:'100vh', background:sayfaArkaPlani, color:tema.text, fontFamily:font.family, display:'flex', alignItems:'center', justifyContent:'center', padding:isMobile ? '1rem' : '2rem' }}>
        <style>{`
          .btn-hover { transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.18s ease, background 0.18s ease, color 0.18s ease, opacity 0.18s ease; }
          .btn-hover:hover { transform: translateY(-1px); box-shadow: ${tema.hoverShadow}; border-color: ${tema.hoverBorder} !important; }
          input:focus, select:focus { border-color: ${tema.primary} !important; outline: none; }
          * { box-sizing: border-box; }
        `}</style>
        <div style={{ width:'100%', maxWidth:980, background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, boxShadow:tema.shadow, overflow:'hidden' }}>
          <div style={{ padding:isMobile ? '22px 18px' : '28px 32px', borderBottom:`1px solid ${tema.border}`, display:'flex', alignItems:isMobile ? 'flex-start' : 'center', justifyContent:'space-between', gap:16, flexDirection:isMobile ? 'column' : 'row' }}>
            <div>
              <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase', fontWeight:800 }}>Kurulum</p>
              <h1 style={{ margin:'7px 0 0', fontSize:isMobile ? 22 : 26, color:tema.textStrong, fontWeight:800, letterSpacing:0 }}>Başlangıç seçimleri</h1>
            </div>
            <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
              {setupBasliklari.map((label, index) => (
                <span key={label} style={{ padding:'7px 10px', borderRadius:999, border:`1px solid ${index === setupAdim ? tema.primary : tema.border}`, background:index === setupAdim ? `${tema.primary}18` : tema.cardSoft, color:index === setupAdim ? tema.primaryLight : tema.faint, fontSize:10, fontWeight:800 }}>
                  {index + 1}. {label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding:isMobile ? '20px 18px' : '26px 32px', minHeight:isMobile ? 420 : 500 }}>
            {setupAdim === 0 && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
                  <div>
                    <p style={{ margin:'0 0 5px', fontSize:17, color:tema.textStrong, fontWeight:800 }}>Tema paletini seç</p>
                    <p style={{ margin:0, fontSize:12, color:tema.muted }}>Flat UI paletlerinden biriyle başla. Light/Dark eşini sonra tek tuşla değiştirebilirsin.</p>
                  </div>
                  <button onClick={() => setAktifTema(seciliTema.pairedThemeKey)} className="btn-hover" style={{ ...compactActionStyle, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted }}>
                    {tema.mode === 'dark' ? <Sun {...iconProps} /> : <Moon {...iconProps} />}{tema.mode === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap:12 }}>
                  {PALET_SIRASI.map(paletKey => {
                    const palet = PALETLER[paletKey]
                    const active = seciliTema.palette === paletKey
                    return (
                      <button
                        key={paletKey}
                        onClick={() => {
                          const nextKey = `${paletKey}-${tema.mode}-1`
                          setAktifTema(FLAT_TEMALAR[nextKey] ? nextKey : `${paletKey}-dark-1`)
                          setAktifTemaPaleti(paletKey)
                          setTemaSekmesi(tema.mode)
                        }}
                        className="btn-hover"
                        style={{ padding:14, borderRadius:14, border:active ? `2px solid ${tema.primary}` : `1px solid ${tema.border}`, background:active ? `${tema.primary}10` : tema.cardSoft, color:tema.text, cursor:'pointer', textAlign:'left', position:'relative' }}
                      >
                        <p style={{ margin:'0 0 12px', fontSize:14, color:tema.textStrong, fontWeight:800 }}>{palet.name}</p>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:5 }}>
                          {palet.colors.slice(0, 10).map(color => (
                            <span key={color.hex} title={color.name} style={{ height:22, borderRadius:6, background:color.hex, border:'1px solid rgba(255,255,255,0.12)' }} />
                          ))}
                        </div>
                        {active && (
                          <span style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:'50%', background:tema.primary, color:tema.onPrimary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Check size={13} strokeWidth={2.4} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {setupAdim === 1 && (
              <div>
                <div style={{ marginBottom:16 }}>
                  <p style={{ margin:'0 0 5px', fontSize:17, color:tema.textStrong, fontWeight:800 }}>Elindeki kaynakları seç</p>
                  <p style={{ margin:0, fontSize:12, color:tema.muted }}>Seçimler görev formunda dersine göre önerilir. Kurulumdan sonra Kaynaklarım alanından değiştirilebilir.</p>
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                  {(['TYT', 'AYT'] as SinavTuru[]).map(sinav => (
                    <button key={sinav} onClick={() => kaynakSinavDegistir(sinav)} className="btn-hover" style={{ ...compactActionStyle, background:aktifKaynakSinav === sinav ? tema.primary : tema.cardSoft, border:`1px solid ${aktifKaynakSinav === sinav ? tema.primary : tema.border}`, color:aktifKaynakSinav === sinav ? tema.onPrimary : tema.muted }}>
                      {sinav}
                    </button>
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'minmax(170px, 210px) minmax(170px, 210px) 1fr', gap:10, alignItems:'center', marginBottom:14 }}>
                  <select value={aktifKaynakDers} onChange={e => { setAktifKaynakDers(e.target.value); setAktifKaynakYayinevi('Tümü') }} style={{ fontSize:12, padding:'11px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, appearance:'none', WebkitAppearance:'none' }}>
                    {filtreDersleri.map(ders => <option key={ders}>{ders}</option>)}
                  </select>
                  <select value={aktifKaynakYayinevi} onChange={e => setAktifKaynakYayinevi(e.target.value)} style={{ fontSize:12, padding:'11px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, appearance:'none', WebkitAppearance:'none' }}>
                    {filtreYayinevleri.map(yayinevi => <option key={yayinevi}>{yayinevi}</option>)}
                  </select>
                  <p style={{ margin:0, fontSize:11, color:tema.faint, textAlign:isMobile ? 'left' : 'right' }}>{kullaniciKaynakIds.length} kaynak seçili</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(6, minmax(0, 1fr))', gap:10, maxHeight:isMobile ? 420 : 360, overflowY:'auto', paddingRight:4 }}>
                  {katalogFiltreli.map(kaynak => {
                    const selected = kullaniciKaynakIdSet.has(kaynak.id)
                    return (
                      <button key={kaynak.id} onClick={() => kaynakSecimiDegistir(kaynak.id)} className="btn-hover" style={{ border:`1px solid ${selected ? tema.primary : tema.border}`, borderRadius:12, background:selected ? `${tema.primary}12` : tema.cardSoft, color:tema.text, cursor:'pointer', padding:0, overflow:'hidden', textAlign:'left', position:'relative' }}>
                        {renderKaynakKapak(kaynak)}
                        <div style={{ padding:'8px 8px 9px' }}>
                          <p style={{ margin:'0 0 4px', fontSize:10, color:tema.textStrong, fontWeight:800, lineHeight:1.3 }}>{kaynak.ad}</p>
                          <p style={{ margin:0, fontSize:9, color:tema.faint, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{kaynak.yayinevi}</p>
                        </div>
                        {selected && (
                          <span style={{ position:'absolute', top:7, right:7, width:20, height:20, borderRadius:'50%', background:tema.primary, color:tema.onPrimary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Check size={12} strokeWidth={2.4} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {setupAdim === 2 && (
              <div>
                <div style={{ marginBottom:16 }}>
                  <p style={{ margin:'0 0 5px', fontSize:17, color:tema.textStrong, fontWeight:800 }}>Kaynak görünümünü seç</p>
                  <p style={{ margin:0, fontSize:12, color:tema.muted }}>Günlük hazırlık alanında kitaplar yazı listesi veya kapaklı grid olarak gösterilir.</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap:12 }}>
                  {([
                    ['text', 'Yazı', 'Sade, hızlı taranan kaynak listesi.', <Type key="type" size={20} strokeWidth={2.1} />],
                    ['visual', 'Görsel', 'Kapak alanlı kompakt hazırlık grid’i.', <ImageIcon key="image" size={20} strokeWidth={2.1} />],
                  ] as const).map(([key, name, desc, icon]) => {
                    const active = kaynakGorunumu === key
                    return (
                      <button key={key} onClick={() => setKaynakGorunumu(key)} className="btn-hover" style={{ padding:18, borderRadius:15, border:active ? `2px solid ${tema.primary}` : `1px solid ${tema.border}`, background:active ? `${tema.primary}10` : tema.cardSoft, color:tema.text, cursor:'pointer', textAlign:'left', position:'relative', minHeight:150 }}>
                        <div style={{ width:42, height:42, borderRadius:12, background:active ? `${tema.primary}20` : tema.card, border:`1px solid ${active ? tema.primary : tema.border}`, color:active ? tema.primaryLight : tema.faint, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                          {icon}
                        </div>
                        <p style={{ margin:'0 0 7px', fontSize:17, color:tema.textStrong, fontWeight:800 }}>{name}</p>
                        <p style={{ margin:0, fontSize:12, color:tema.muted, lineHeight:1.5 }}>{desc}</p>
                        {active && (
                          <span style={{ position:'absolute', top:12, right:12, width:22, height:22, borderRadius:'50%', background:tema.primary, color:tema.onPrimary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Check size={13} strokeWidth={2.4} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {setupAdim === 3 && (
              <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : '1fr 1fr', gap:14 }}>
                {[
                  ['Tema', `${seciliTema.paletteName} / ${tema.mode === 'dark' ? 'Dark' : 'Light'}`],
                  ['Kaynak', `${kullaniciKaynakIds.length} kitap seçili`],
                  ['Hazırlık', kaynakGorunumu === 'visual' ? 'Görsel kapak grid’i' : 'Yazı listesi'],
                  ['Sonraki adım', 'Ana ekranda kısa interaktif tanıtım'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding:'18px 16px', border:`1px solid ${tema.border}`, borderRadius:14, background:tema.cardSoft }}>
                    <p style={{ margin:'0 0 7px', fontSize:11, color:tema.faint, fontWeight:800, letterSpacing:0.6, textTransform:'uppercase' }}>{label}</p>
                    <p style={{ margin:0, fontSize:15, color:tema.textStrong, fontWeight:800 }}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding:isMobile ? '16px 18px' : '18px 32px', borderTop:`1px solid ${tema.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
            <button onClick={setupTamamla} className="btn-hover" style={{ ...compactActionStyle, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.faint }}>
              atla
            </button>
            <div style={{ display:'flex', gap:8 }}>
              {setupAdim > 0 && (
                <button onClick={() => setSetupAdim(adim => Math.max(0, adim - 1))} className="btn-hover" style={{ ...compactActionStyle, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted }}>
                  geri
                </button>
              )}
              <button onClick={() => setupAdim === 3 ? setupTamamla() : setSetupAdim(adim => Math.min(3, adim + 1))} className="btn-hover" style={{ ...compactActionStyle, background:tema.primary, border:'none', color:tema.onPrimary }}>
                {setupAdim === 3 ? 'kurulumu bitir' : 'ileri'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleRootClick}
      onPointerMove={handlePointerDragMove}
      onPointerUp={handlePointerDragEnd}
      onPointerCancel={handlePointerDragCancel}
      className={customCursorAktif ? 'custom-cursor-root' : undefined}
      style={{ background:sayfaArkaPlani, minHeight:'100vh', color:tema.text, fontFamily:font.family, padding: isMobile ? '1rem 0.5rem 3rem' : '1.5rem 1rem 3rem' }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        .slide-in { animation: slideIn 0.2s ease-out; }
        .slide-up { animation: slideUp 0.3s ease-out; }
        .btn-hover { transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.18s ease, background 0.18s ease, color 0.18s ease, opacity 0.18s ease; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: ${tema.hoverShadow}; border-color: ${tema.hoverBorder} !important; }
        .btn-hover:active { transform: translateY(0); }
        .gorev-card { transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.18s ease, background 0.18s ease, opacity 0.18s ease; backdrop-filter: blur(8px); }
        .gorev-card:hover { transform: translateY(-1px); box-shadow: ${tema.mode === 'dark' ? '0 12px 28px rgba(0,0,0,0.28)' : '0 10px 22px rgba(15,23,42,0.10)'}; border-color: ${tema.mode === 'dark' ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.14)'} !important; }
        .gorev-card.dragging { opacity: 0.5; transform: rotate(2deg) scale(0.98); cursor: grabbing; }
        .gorev-card, .gorev-card * { user-select: none; -webkit-user-select: none; }
        .task-drag-lock, .task-drag-lock * { user-select: none !important; -webkit-user-select: none !important; }
        .task-drag-lock ::selection { background: transparent; }
        .task-action { transition: color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease; }
        .task-action:hover { transform: translateY(-1px); }
        .task-action-copy:hover { color: ${tema.primaryLight} !important; background: ${tema.primary}18 !important; box-shadow: inset 0 0 0 1px ${tema.primary}40; }
        .task-action-delete:hover { color: #f87171 !important; background: rgba(239,68,68,0.14) !important; box-shadow: inset 0 0 0 1px rgba(248,113,113,0.34); }
        .day-column { transition: all 0.2s ease; }
        .day-column.drag-over { background: ${tema.primary}10; border-radius: 14px; outline: 1px solid ${tema.primary}30; outline-offset: 2px; }
        .progress-bar { transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        input:focus, select:focus { border-color: ${tema.primary} !important; outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${tema.card}; }
        ::-webkit-scrollbar-thumb { background: ${tema.border}; border-radius: 2px; }
        .button-inner { display:inline-flex; align-items:center; justify-content:center; gap:7px; white-space:nowrap; }
        .icon-only { line-height:0; }
        .custom-cursor-root, .custom-cursor-root * { cursor: none !important; }
        .custom-cursor {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 5000;
          pointer-events: none;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          border: none;
          border-radius: 0;
          color: ${tema.primaryLight};
          background: transparent;
          box-shadow: none;
          filter: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.12s ease;
        }
        @media (pointer: coarse), (prefers-reduced-motion: reduce) {
          .custom-cursor-root, .custom-cursor-root * { cursor: auto !important; }
          .custom-cursor { display:none; }
          .fade-in, .slide-in, .slide-up { animation:none; }
        }
      `}</style>

      {customCursorAktif && cursorHazir && (
        <div
          className={`custom-cursor cursor-${aktifCursor} ${cursorMode}`}
          style={{ left: mouseKonum.x, top: mouseKonum.y, opacity: kopyaDrag || draggingTask ? 0.78 : 1 }}
          aria-hidden="true"
        >
          <MousePointer2 size={15} strokeWidth={2.2} />
        </div>
      )}

      {cursorHazir && draggingTask && !kopyaDrag && (
        <div style={{ position:'fixed', left:mouseKonum.x, top:mouseKonum.y, transform:'translate(-50%, -50%)', zIndex:3000, width:160, padding:'10px 8px 9px', border:`1px solid ${tema.primary}`, borderRadius:10, background:tema.card, boxShadow:tema.shadow, pointerEvents:'none', opacity:0.92 }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:getDersRengi(draggingTask.ders, tema.mode), borderRadius:'3px 0 0 3px' }} />
          <div style={{ paddingLeft:10 }}>
            <p style={{ margin:'0 0 2px', fontSize:10, color:getDersRengi(draggingTask.ders, tema.mode), fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{draggingTask.ders}</p>
            <p style={{ margin:'0 0 6px', fontSize:11, color:tema.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4, fontWeight:500 }}>{draggingTask.konu}</p>
            <span style={{ fontSize:10, color:tema.faint, fontWeight:500 }}>taşı</span>
          </div>
        </div>
      )}

      {/* SÜRE MODAL */}
      {sureModal && (
        <div onMouseDown={(e) => closeOnBackdrop(e, () => setSureModal(null))} className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:440, width:'100%', boxShadow:tema.shadow }}>
            <p style={{ margin:'0 0 6px', fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase', display:'flex', alignItems:'center', gap:7 }}><CheckCircle2 size={13} strokeWidth={2.1} /> Görev Tamamlandı</p>
            <p style={{ margin:'0 0 6px', fontSize:20, color:tema.textStrong, fontWeight:600 }}>{sureModal.konu}</p>
            <p style={{ margin:'0 0 24px', fontSize:13, color:getDersRengi(sureModal.ders, tema.mode) }}>{sureModal.ders}</p>
            <p style={{ margin:'0 0 12px', fontSize:14, color:tema.text }}>Kaç dakikada tamamladın?</p>
            <input autoFocus value={sureInput} onChange={e => setSureInput(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') sureKaydet(); if(e.key==='Escape') setSureModal(null); }}
              type="number" min="0" placeholder="örn: 45"
              style={{ width:'100%', background:tema.cardSoft, border:`2px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:28, padding:'16px 20px', outline:'none', textAlign:'center', fontWeight:700, boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:12, marginTop:20 }}>
              <button onClick={() => setSureModal(null)} className="btn-hover" style={{ ...modalActionStyle, flex:1, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.faint }}><X {...iconProps} /> iptal</button>
              <button onClick={sureKaydet} className="btn-hover" style={{ ...modalActionStyle, flex:1, background:tema.success, border:'none', color:tema.successText }}><Save {...iconProps} /> kaydet</button>
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
              className="btn-hover"
              style={{ width:'100%', marginTop:12, padding:'12px 0', background:'none', border:'none', color:tema.faint, cursor:'pointer', fontSize:12, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7 }}><Check {...iconProps} /> süre bilmiyorum, sadece tamamla</button>
          </div>
        </div>
      )}

      {/* DETAY MODAL */}
      {detayModal && (
        <div onMouseDown={(e) => closeOnBackdrop(e, () => setDetayModal(null))} className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:440, width:'100%', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase' }}>Görev Detayları</p>
                <p style={{ margin:'4px 0 0', fontSize:20, color:tema.textStrong, fontWeight:600 }}>Görevi Düzenle</p>
              </div>
              <button onClick={() => setDetayModal(null)} className="btn-hover icon-only" aria-label="kapat" title="kapat" style={{ background:tema.border, border:'none', color:tema.muted, cursor:'pointer', width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16} strokeWidth={2.2} /></button>
            </div>

            <p style={{ margin:'0 0 8px', fontSize:12, color:tema.muted, fontWeight:500 }}>Görev Adı</p>
            <input autoFocus value={editKonu} onChange={e => setEditKonu(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') detayKaydet(); if(e.key==='Escape') setDetayModal(null); }}
              placeholder="görev adı..."
              style={{ width:'100%', background:tema.cardSoft, border:`2px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:16, padding:'14px 16px', outline:'none', boxSizing:'border-box', marginBottom:20 }} />

            <p style={{ margin:'0 0 8px', fontSize:12, color:tema.muted, fontWeight:500 }}>Ders</p>
            <select value={editDers} onChange={e => handleEditDersDegistir(e.target.value)}
              style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:14, padding:'14px 16px', outline:'none', boxSizing:'border-box', marginBottom:14, appearance:'none', WebkitAppearance:'none' }}>
              {DERSLER.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {renderDetayKaynakSecici()}

            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setDetayModal(null)} className="btn-hover" style={{ ...modalActionStyle, flex:1, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.faint }}><X {...iconProps} /> iptal</button>
              <button onClick={detayKaydet} className="btn-hover" style={{ ...modalActionStyle, flex:1, background:tema.primary, border:'none', color:tema.onPrimary }}><Save {...iconProps} /> kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authModal && (
        <div onMouseDown={(e) => closeOnBackdrop(e, () => { setAuthModal(false); setAuthError('') })} className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:420, width:'100%', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <p style={{ margin:0, fontSize:18, color:tema.textStrong, fontWeight:600 }}>{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</p>
                <p style={{ margin:'4px 0 0', fontSize:12, color:tema.faint }}>Görevlerin cloud&apos;da kayıtlı kalsın</p>
              </div>
              <button onClick={() => { setAuthModal(false); setAuthError(''); }} className="btn-hover icon-only" aria-label="kapat" title="kapat" style={{ background:tema.cardSoft, border:'none', color:tema.muted, cursor:'pointer', width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16} strokeWidth={2.2} /></button>
            </div>

            {authError && (
              <div style={{ marginBottom:16, padding:'10px 14px', background:'#7f1d1d30', border:'1px solid #7f1d1d', borderRadius:10, fontSize:12, color:'#fca5a5' }}>
                {authError}
              </div>
            )}

            <input value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="email" type="email"
              style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:15, padding:'14px 16px', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
            <input value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="şifre (min 8, harf + rakam)" type="password"
              onKeyDown={e => { if(e.key==='Enter') handleAuth(); }}
              style={{ width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:15, padding:'14px 16px', outline:'none', boxSizing:'border-box' }} />
            {authMode === 'register' && (
              <p style={{ margin:'8px 0 0', fontSize:10, color:tema.faint, lineHeight:1.45 }}>En az 8 karakter, büyük/küçük harf ve rakam içermeli.</p>
            )}

            <button onClick={handleAuth} disabled={authLoading}
              style={{ width:'100%', marginTop:16, padding:'14px 0', background:tema.primary, border:'none', borderRadius:12, color:tema.onPrimary, fontWeight:600, fontSize:14, cursor: authLoading ? 'not-allowed' : 'pointer', opacity: authLoading ? 0.6 : 1 }}>
              <span className="button-inner">{authMode === 'login' ? <LogIn {...iconProps} /> : <Plus {...iconProps} />}{authLoading ? 'bekle...' : authMode === 'login' ? 'giriş yap' : 'kayıt ol'}</span>
            </button>

            {renderOAuthSecenekleri()}

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
        <div onMouseDown={(e) => closeOnBackdrop(e, () => setAyarlarAcik(false))} className="slide-in" style={{ position:'fixed', inset:0, zIndex:2000, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'32px 36px', maxWidth:480, width:'100%', maxHeight:'85vh', overflowY:'auto', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div>
                <p style={{ margin:0, fontSize:18, color:tema.textStrong, fontWeight:600 }}>Ayarlar</p>
                <p style={{ margin:'4px 0 0', fontSize:12, color:tema.faint }}>Tasarım, kaynak ve hesap tercihleri</p>
              </div>
              <button onClick={() => setAyarlarAcik(false)} className="btn-hover icon-only" aria-label="kapat" title="kapat" style={{ background:tema.cardSoft, border:'none', color:tema.muted, cursor:'pointer', width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={16} strokeWidth={2.2} /></button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap:6, padding:4, marginBottom:16, background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12 }}>
              {[
                ['tema', 'Tema Rengi'],
                ['font', 'Font'],
                ['cursor', 'Cursor'],
                ['kaynak', 'Kaynak'],
                ['hesap', 'Hesap'],
              ].map(([key, label]) => {
                const active = ayarSekmesi === key
                return (
                  <button
                    key={key}
                    onClick={() => setAyarSekmesi(key as AyarSekmesi)}
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
                      letterSpacing:0
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {ayarSekmesi === 'tema' ? (
              aktifTemaPaleti ? (
                <>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:14 }}>
                    <button
                      onClick={() => setAktifTemaPaleti(null)}
                      className="btn-hover"
                      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 12px', borderRadius:9, border:`1px solid ${tema.border}`, background:tema.cardSoft, color:tema.muted, cursor:'pointer', fontSize:11, fontWeight:700 }}
                    >
                      <ChevronLeft size={13} strokeWidth={2.2} /> Paletler
                    </button>
                    <p style={{ margin:0, fontSize:12, color:tema.textStrong, fontWeight:800 }}>{PALETLER[aktifTemaPaleti].name}</p>
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
                            letterSpacing:0
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
                          padding:'18px 15px',
                          borderRadius:14,
                          border: aktifTema === key ? `2px solid ${t.primary}` : `1px solid ${tema.border}`,
                          background:t.card,
                          cursor:'pointer',
                          textAlign:'left',
                          position:'relative',
                          overflow:'hidden',
                          transition:'all 0.2s'
                        }}
                      >
                        <div style={{ display:'flex', gap:6, marginBottom:11 }}>
                          {t.swatches.slice(0, 4).map((swatch, swatchIndex) => (
                            <div key={`${key}-${swatch}`} style={{ width:22, height:22, borderRadius:6, background:swatch, border:`1px solid ${t.border}`, opacity: swatchIndex > 1 ? 0.72 : 1 }} />
                          ))}
                        </div>
                        <p style={{ margin:0, fontSize:13, color:t.textStrong, fontWeight:700 }}>{t.name.replace(`${t.paletteName} `, '')}</p>
                        <p style={{ margin:'4px 0 0', fontSize:10, color:t.muted, fontWeight:600 }}>{t.paletteName}</p>
                        {aktifTema === key && (
                          <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:t.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Check size={12} strokeWidth={2.4} color={t.onPrimary} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
                  {PALET_SIRASI.map(paletKey => {
                    const palet = PALETLER[paletKey]
                    const active = seciliTema.palette === paletKey
                    return (
                      <button
                        key={paletKey}
                        onClick={() => {
                          setAktifTemaPaleti(paletKey)
                          setTemaSekmesi(active ? seciliTema.mode : 'dark')
                        }}
                        className="btn-hover"
                        style={{
                          padding:'18px 15px',
                          borderRadius:14,
                          border: active ? `2px solid ${tema.primary}` : `1px solid ${tema.border}`,
                          background:tema.cardSoft,
                          color:tema.text,
                          cursor:'pointer',
                          textAlign:'left',
                          position:'relative',
                          overflow:'hidden'
                        }}
                      >
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:4, marginBottom:12 }}>
                          {palet.colors.slice(0, 10).map(renk => (
                            <span key={renk.hex} style={{ height:14, borderRadius:4, background:renk.hex, boxShadow:`inset 0 0 0 1px ${tema.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}` }} />
                          ))}
                        </div>
                        <p style={{ margin:0, fontSize:14, color:tema.textStrong, fontWeight:800, display:'inline-flex', alignItems:'center', gap:7 }}>
                          <Palette size={13} strokeWidth={2.1} /> {palet.name}
                        </p>
                        <p style={{ margin:'5px 0 0', fontSize:10, color:tema.faint, fontWeight:600 }}>6 Dark + 6 Light</p>
                        {active && (
                          <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:tema.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Check size={12} strokeWidth={2.4} color={tema.onPrimary} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            ) : ayarSekmesi === 'font' ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
                {Object.entries(FONTLAR).map(([key, f]) => (
                  <button
                    key={key}
                    onClick={() => setAktifFont(key as FontKey)}
                    className="btn-hover"
                    style={{
                      padding:'18px 16px',
                      borderRadius:16,
                      border: aktifFont === key ? `2px solid ${tema.primary}` : `1px solid ${tema.border}`,
                      background:tema.cardSoft,
                      color:tema.text,
                      cursor:'pointer',
                      textAlign:'left',
                      position:'relative',
                      transition:'all 0.2s',
                      fontFamily:f.family
                    }}
                  >
                    <p style={{ margin:0, fontSize:11, color:tema.primaryLight, fontWeight:600 }}>{f.tone}</p>
                    <p style={{ margin:'8px 0 12px', fontSize:16, color:tema.textStrong, fontWeight:600 }}>{f.name}</p>
                    <div style={{ padding:'10px 12px', borderRadius:10, background:tema.card, border:`1px solid ${tema.border}` }}>
                      <p style={{ margin:0, fontSize:13, color:tema.text, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.preview}</p>
                      <p style={{ margin:'5px 0 0', fontSize:10, color:tema.faint }}>TYT Mat · 45dk</p>
                    </div>
                    {aktifFont === key && (
                      <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:tema.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={12} strokeWidth={2.4} color={tema.onPrimary} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : ayarSekmesi === 'cursor' ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
                {Object.entries(CURSORLAR).map(([key, c]) => {
                  const active = aktifCursor === key
                  return (
                    <button
                      key={key}
                      onClick={() => setAktifCursor(key as CursorKey)}
                      className="btn-hover"
                      style={{
                        padding:'18px 16px',
                        borderRadius:16,
                        border: active ? `2px solid ${tema.primary}` : `1px solid ${tema.border}`,
                        background:tema.cardSoft,
                        color:tema.text,
                        cursor:'pointer',
                        textAlign:'left',
                        position:'relative',
                        transition:'all 0.2s',
                        minHeight:122
                      }}
                    >
                      <p style={{ margin:0, fontSize:11, color:tema.primaryLight, fontWeight:600 }}>{c.tone}</p>
                      <p style={{ margin:'8px 0 12px', fontSize:16, color:tema.textStrong, fontWeight:600 }}>{c.name}</p>
                      <div style={{ height:38, borderRadius:10, background:tema.card, border:`1px solid ${tema.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        {key === 'system' ? (
                          <MousePointer2 size={18} strokeWidth={1.8} color={tema.faint} />
                        ) : (
                          <MousePointer2 size={18} strokeWidth={2.2} color={tema.primaryLight} />
                        )}
                      </div>
                      <p style={{ margin:'10px 0 0', fontSize:10, color:tema.faint }}>{c.preview}</p>
                      {active && (
                        <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:tema.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Check size={12} strokeWidth={2.4} color={tema.onPrimary} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : ayarSekmesi === 'kaynak' ? (
              <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
                {[
                  ['text', 'Yazı', 'Kaynaklar sade liste olarak görünür.', <Type key="type" size={18} strokeWidth={2.1} />],
                  ['visual', 'Görsel', 'Kapak alanlı kompakt grid altyapısı kullanılır.', <ImageIcon key="image" size={18} strokeWidth={2.1} />],
                ].map(([key, name, desc, icon]) => {
                  const active = kaynakGorunumu === key
                  return (
                    <button
                      key={key as string}
                      onClick={() => setKaynakGorunumu(key as KaynakGorunumu)}
                      className="btn-hover"
                      style={{
                        padding:'18px 16px',
                        borderRadius:16,
                        border: active ? `2px solid ${tema.primary}` : `1px solid ${tema.border}`,
                        background:tema.cardSoft,
                        color:tema.text,
                        cursor:'pointer',
                        textAlign:'left',
                        position:'relative',
                        transition:'all 0.2s',
                        minHeight:126
                      }}
                    >
                      <div style={{ width:38, height:38, borderRadius:12, background:active ? `${tema.primary}20` : tema.card, border:`1px solid ${active ? tema.primary : tema.border}`, color:active ? tema.primaryLight : tema.faint, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                        {icon}
                      </div>
                      <p style={{ margin:'0 0 8px', fontSize:16, color:tema.textStrong, fontWeight:700 }}>{name}</p>
                      <p style={{ margin:0, fontSize:11, color:tema.faint, lineHeight:1.45 }}>{desc}</p>
                      {active && (
                        <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', background:tema.primary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Check size={12} strokeWidth={2.4} color={tema.onPrimary} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => { tutorialBaslat(); setAyarlarAcik(false) }}
                className="btn-hover"
                style={{ ...compactActionStyle, width:'100%', marginTop:14, background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted }}
              >
                <BookOpen {...iconProps} /> başlangıç rehberini tekrar aç
              </button>
              </>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ padding:'16px', border:`1px solid ${tema.border}`, borderRadius:14, background:tema.cardSoft }}>
                  <p style={{ margin:'0 0 6px', fontSize:13, color:tema.textStrong, fontWeight:800 }}>Oturum</p>
                  <p style={{ margin:0, fontSize:12, color:tema.muted }}>{user ? 'Hesapla giriş yapıldı.' : misafirModu ? 'Misafir modundasın.' : 'Giriş yapılmadı.'}</p>
                </div>
                {user && (
                  <button
                    onClick={() => { setSetupAdim(0); setSetupAcik(true); setAyarlarAcik(false) }}
                    className="btn-hover"
                    style={{ ...compactActionStyle, width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted }}
                  >
                    <Palette {...iconProps} /> kurulum ekranını tekrar aç
                  </button>
                )}
                <button
                  onClick={() => { tutorialBaslat(); setAyarlarAcik(false) }}
                  className="btn-hover"
                  style={{ ...compactActionStyle, width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted }}
                >
                  <BookOpen {...iconProps} /> tutorialı tekrar başlat
                </button>
                {user ? (
                  <button
                    onClick={() => { setAyarlarAcik(false); void handleLogout() }}
                    className="btn-hover"
                    style={{ ...compactActionStyle, width:'100%', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:'#f87171' }}
                  >
                    <LogOut {...iconProps} /> çıkış yap
                  </button>
                ) : (
                  <button
                    onClick={() => { setAuthMode('login'); setAuthModal(true); setAyarlarAcik(false) }}
                    className="btn-hover"
                    style={{ ...compactActionStyle, width:'100%', background:tema.primary, border:'none', color:tema.onPrimary }}
                  >
                    <LogIn {...iconProps} /> giriş yap
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOT ARŞİVİ */}
      {notlarAcik && (
        <div onMouseDown={(e) => closeOnBackdrop(e, () => setNotlarAcik(false))} className="slide-in" style={{ position:'fixed', inset:0, zIndex:2100, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:'28px 30px', maxWidth:620, width:'100%', maxHeight:'82vh', overflowY:'auto', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
              <div>
                <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase', fontWeight:700 }}>Not Arşivi</p>
                <p style={{ margin:'5px 0 0', fontSize:20, color:tema.textStrong, fontWeight:700 }}>Günlük Notlar</p>
              </div>
              <button onClick={() => setNotlarAcik(false)} className="btn-hover icon-only" aria-label="kapat" title="kapat" style={{ ...iconButtonStyle, background:tema.cardSoft }}><X size={16} strokeWidth={2.2} /></button>
            </div>
            {gunlukNotlar.length === 0 ? (
              <div style={{ padding:'28px 20px', border:`1px dashed ${tema.border}`, borderRadius:14, textAlign:'center', color:tema.faint }}>
                <NotebookPen size={22} strokeWidth={1.9} />
                <p style={{ margin:'10px 0 0', fontSize:13 }}>Henüz not yok.</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {gunlukNotlar.map(not => {
                  const notTarihi = new Date(`${not.tarih}T12:00:00`)
                  return (
                    <div key={not.id} style={{ padding:'13px 14px', border:`1px solid ${tema.border}`, borderRadius:12, background:tema.cardSoft }}>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:12, alignItems:'flex-start' }}>
                        <div style={{ minWidth:0 }}>
                          <p style={{ margin:'0 0 6px', fontSize:10, color:tema.primaryLight, fontWeight:700, letterSpacing:0.6 }}>{formatGunTarihi(notTarihi)}</p>
                          <p style={{ margin:0, fontSize:13, color:tema.text, lineHeight:1.5, whiteSpace:'pre-wrap' }}>{not.icerik}</p>
                        </div>
                        <button onClick={() => gunlukNotSil(not.id)} className="btn-hover icon-only task-action task-action-delete" aria-label="notu sil" title="notu sil" style={{ width:28, height:28, borderRadius:8, background:'transparent', border:'none', color:tema.faint, cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto' }}><Trash2 size={14} strokeWidth={2.1} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* KAYNAKLARIM */}
      {kaynaklarAcik && (
        <div onMouseDown={(e) => closeOnBackdrop(e, () => setKaynaklarAcik(false))} className="slide-in" style={{ position:'fixed', inset:0, zIndex:2100, background:tema.overlay, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:20, padding:isMobile ? '22px 18px' : '28px 30px', maxWidth:920, width:'100%', maxHeight:'86vh', overflowY:'auto', boxShadow:tema.shadow }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, gap:12 }}>
              <div>
                <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:2, textTransform:'uppercase', fontWeight:700 }}>Kaynak Kitap Sistemi</p>
                <p style={{ margin:'5px 0 0', fontSize:20, color:tema.textStrong, fontWeight:800 }}>Kaynaklarım</p>
              </div>
              <button onClick={() => setKaynaklarAcik(false)} className="btn-hover icon-only" aria-label="kapat" title="kapat" style={{ ...iconButtonStyle, background:tema.cardSoft }}><X size={16} strokeWidth={2.2} /></button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, padding:4, marginBottom:14, background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12 }}>
              {([
                ['katalog', 'Katalog'],
                ['secili', `Seçilen kaynaklar (${kullaniciKaynakIds.length})`],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setKaynaklarSekme(key)}
                  className="btn-hover"
                  style={{ padding:'10px 0', border:'none', borderRadius:8, background:kaynaklarSekme === key ? tema.primary : 'transparent', color:kaynaklarSekme === key ? tema.onPrimary : tema.muted, cursor:'pointer', fontSize:12, fontWeight:800 }}
                >
                  {label}
                </button>
              ))}
            </div>

            {kaynaklarSekme === 'katalog' && (
              <>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
              {(['TYT', 'AYT'] as SinavTuru[]).map(sinav => (
                <button key={sinav} onClick={() => kaynakSinavDegistir(sinav)} className="btn-hover" style={{ ...compactActionStyle, background:aktifKaynakSinav === sinav ? tema.primary : tema.cardSoft, border:`1px solid ${aktifKaynakSinav === sinav ? tema.primary : tema.border}`, color:aktifKaynakSinav === sinav ? tema.onPrimary : tema.muted }}>
                  {sinav}
                </button>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'minmax(180px, 220px) minmax(180px, 220px) 1fr', gap:10, alignItems:'center', marginBottom:16 }}>
              <select value={aktifKaynakDers} onChange={e => { setAktifKaynakDers(e.target.value); setAktifKaynakYayinevi('Tümü') }} style={{ fontSize:12, padding:'11px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, appearance:'none', WebkitAppearance:'none' }}>
                {filtreDersleri.map(ders => <option key={ders}>{ders}</option>)}
              </select>
              <select value={aktifKaynakYayinevi} onChange={e => setAktifKaynakYayinevi(e.target.value)} style={{ fontSize:12, padding:'11px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, appearance:'none', WebkitAppearance:'none' }}>
                {filtreYayinevleri.map(yayinevi => <option key={yayinevi}>{yayinevi}</option>)}
              </select>
              <p style={{ margin:0, fontSize:11, color:tema.faint, textAlign:isMobile ? 'left' : 'right' }}>{kullaniciKaynakIds.length} kaynak seçili</p>
            </div>
              </>
            )}

            <div style={{ display:'grid', gridTemplateColumns:isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap:10 }}>
              {kaynakModalListesi.length === 0 ? (
                <div style={{ gridColumn:'1 / -1', padding:'26px 18px', border:`1px dashed ${tema.border}`, borderRadius:14, background:tema.cardSoft, color:tema.faint, textAlign:'center', fontSize:13 }}>
                  Henüz seçilen kaynak yok.
                </div>
              ) : kaynakModalListesi.map(kaynak => {
                const selected = kullaniciKaynakIdSet.has(kaynak.id)
                return (
                  <button key={kaynak.id} onClick={() => kaynakSecimiDegistir(kaynak.id)} className="btn-hover" style={{ border:`1px solid ${selected ? tema.primary : tema.border}`, borderRadius:12, background:selected ? `${tema.primary}12` : tema.cardSoft, color:tema.text, cursor:'pointer', padding:0, overflow:'hidden', textAlign:'left', position:'relative' }}>
                    {renderKaynakKapak(kaynak)}
                    <div style={{ padding:'10px 10px 11px' }}>
                      <p style={{ margin:'0 0 5px', fontSize:11, color:tema.textStrong, fontWeight:800, lineHeight:1.3 }}>{kaynak.ad}</p>
                      <p style={{ margin:0, fontSize:10, color:tema.faint, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{kaynak.yayinevi}</p>
                    </div>
                    {selected && (
                      <span style={{ position:'absolute', top:8, right:8, width:22, height:22, borderRadius:'50%', background:tema.primary, color:tema.onPrimary, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={13} strokeWidth={2.4} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* HEDEFLİ TUTORIAL */}
      {onboardingAcik && (() => {
        const adim = TUTORIAL_ADIMLARI[onboardingAdim] || TUTORIAL_ADIMLARI[0]
        const sonAdim = onboardingAdim >= TUTORIAL_ADIMLARI.length - 1
        const vw = typeof window === 'undefined' ? 1024 : window.innerWidth
        const vh = typeof window === 'undefined' ? 768 : window.innerHeight
        const tooltipWidth = isMobile ? Math.min(vw - 32, 320) : 330
        const tooltipLeft = tutorialRect
          ? Math.min(Math.max(tutorialRect.left + tutorialRect.width / 2 - tooltipWidth / 2, 16), vw - tooltipWidth - 16)
          : Math.max((vw - tooltipWidth) / 2, 16)
        const tooltipTop = tutorialRect
          ? Math.min(tutorialRect.top + tutorialRect.height + 16, vh - 230)
          : Math.max((vh - 220) / 2, 16)

        return (
          <div style={{ position:'fixed', inset:0, zIndex:2200, pointerEvents:'none' }}>
            <div style={{ position:'absolute', inset:0, background:tema.mode === 'dark' ? 'rgba(0,0,0,0.34)' : 'rgba(15,23,42,0.16)' }} />
            {tutorialRect && (
              <>
                <div style={{ position:'fixed', top:tutorialRect.top - 8, left:tutorialRect.left - 8, width:tutorialRect.width + 16, height:tutorialRect.height + 16, border:`1px solid ${tema.primary}`, borderRadius:14, boxShadow:`0 0 0 9999px ${tema.mode === 'dark' ? 'rgba(0,0,0,0.18)' : 'rgba(15,23,42,0.08)'}, 0 0 0 5px ${tema.primary}18`, pointerEvents:'none' }} />
                <div style={{ position:'fixed', left:tutorialRect.left + tutorialRect.width / 2, top:tutorialRect.top + tutorialRect.height + 6, width:1, height:10, background:tema.primary, opacity:0.8 }} />
              </>
            )}
            <div className="slide-in" style={{ position:'fixed', left:tooltipLeft, top:tooltipTop, width:tooltipWidth, background:tema.card, border:`1px solid ${tema.border}`, borderRadius:16, padding:'16px 16px 15px', boxShadow:tema.shadow, pointerEvents:'auto' }}>
              <div style={{ width:34, height:3, borderRadius:99, background:tema.primary, marginBottom:12 }} />
              <p style={{ margin:'0 0 7px', fontSize:15, color:tema.textStrong, fontWeight:800 }}>{adim.title}</p>
              <p style={{ margin:0, fontSize:12, color:tema.muted, lineHeight:1.55 }}>{adim.desc}</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginTop:15 }}>
                <div style={{ display:'flex', gap:5 }}>
                  {TUTORIAL_ADIMLARI.map((_, index) => (
                    <span key={index} style={{ width:index === onboardingAdim ? 18 : 6, height:6, borderRadius:99, background:index === onboardingAdim ? tema.primary : tema.border, transition:'all 0.18s' }} />
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {onboardingAdim > 0 && (
                    <button onClick={() => setOnboardingAdim(adimIndex => Math.max(0, adimIndex - 1))} className="btn-hover" style={{ ...compactActionStyle, padding:'7px 11px', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.muted }}>geri</button>
                  )}
                  <button onClick={onboardingKapat} className="btn-hover" style={{ ...compactActionStyle, padding:'7px 11px', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.faint }}>atla</button>
                  <button onClick={() => sonAdim ? onboardingKapat() : setOnboardingAdim(adimIndex => adimIndex + 1)} className="btn-hover" style={{ ...compactActionStyle, padding:'7px 12px', background:tema.primary, border:'none', color:tema.onPrimary }}>
                    {sonAdim ? 'bitir' : 'ileri'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* GÜNLÜK ODAK PANELİ */}
      {seciliGun && (
        <div className="slide-in" style={{ position:'fixed', inset:0, zIndex:1500, background:sayfaArkaPlani, color:tema.text, fontFamily:font.family, overflowY:'auto', padding: isMobile ? '1rem 0.75rem 2rem' : '1.5rem 1rem 3rem' }}>
          <div style={{ maxWidth:1180, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(160px, 1fr) minmax(320px, auto) minmax(160px, 1fr)', alignItems:'center', gap:12, marginBottom:18 }}>
              <button onClick={() => setGunlukPanelIndex(null)} className="btn-hover" style={{ ...compactActionStyle, justifySelf:isMobile ? 'start' : 'start', background:tema.card, border:`1px solid ${tema.border}`, color:tema.muted }}>
                <ChevronLeft {...iconProps} /> haftaya dön
              </button>
              <div style={{ textAlign:'center' }}>
                <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:1.8, textTransform:'uppercase', fontWeight:700 }}>Günlük Odak</p>
                <h2 style={{ margin:'4px 0 0', fontSize:isMobile ? 24 : 30, color:tema.textStrong, fontWeight:800 }}>{seciliGunTarihId === tarihId(new Date()) ? 'Bugün' : seciliGun.label}</h2>
                <div style={{ marginTop:12, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                  <button onClick={gunlukOnceki} className="btn-hover icon-only" aria-label="önceki gün" title="önceki gün" style={iconButtonStyle}><ChevronLeft size={16} strokeWidth={2.2} /></button>
                  <p style={{ margin:0, minWidth:160, fontSize:12, color:tema.muted, fontWeight:600 }}>{formatGunTarihi(seciliGun.tarih)}</p>
                  <button onClick={gunlukSonraki} className="btn-hover icon-only" aria-label="sonraki gün" title="sonraki gün" style={iconButtonStyle}><ChevronRight size={16} strokeWidth={2.2} /></button>
                </div>
              </div>
              <div style={{ minHeight:isMobile ? 0 : 34 }} />
            </div>

            <div style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:14, padding:isMobile ? '16px' : '18px 20px', marginBottom:14, display:'grid', gridTemplateColumns:isMobile ? '1fr' : '260px 1fr', gap:18, alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:76, height:76, borderRadius:'50%', background:`conic-gradient(${tema.primary} ${seciliGunYuzde * 3.6}deg, ${tema.border} 0deg)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 1px ${tema.border}` }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:tema.card, display:'flex', alignItems:'center', justifyContent:'center', color:tema.textStrong, fontSize:15, fontWeight:800 }}>{seciliGunYuzde}%</div>
                </div>
                <div>
                  <p style={{ margin:'0 0 5px', fontSize:14, color:tema.textStrong, fontWeight:800, display:'inline-flex', alignItems:'center', gap:7 }}><CheckCircle2 size={14} strokeWidth={2.1} /> Bugünkü ilerleme</p>
                  <p style={{ margin:0, fontSize:12, color:tema.muted }}>{seciliGunTamam} / {seciliGunGorevleri.length} görev tamamlandı</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:10 }}>
                {[
                  ['Toplam', seciliGunGorevleri.length],
                  ['Kalan', seciliGunGorevleri.length - seciliGunTamam],
                  ['Süre', seciliGunSure ? formatSure(seciliGunSure) : '-'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding:'12px 10px', border:`1px solid ${tema.border}`, borderRadius:12, background:tema.cardSoft, textAlign:'center' }}>
                    <p style={{ margin:'0 0 7px', fontSize:10, color:tema.faint, fontWeight:700 }}>{label}</p>
                    <p style={{ margin:0, fontSize:18, color:label === 'Kalan' ? '#f87171' : tema.textStrong, fontWeight:800 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:isMobile ? '1fr' : 'minmax(0, 1.55fr) minmax(280px, 0.85fr)', gap:14, alignItems:'start' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <p style={{ margin:0, fontSize:13, color:tema.textStrong, fontWeight:800, display:'inline-flex', alignItems:'center', gap:7 }}><CalendarDays size={14} strokeWidth={2.1} /> Günün görevleri</p>
                  <button onClick={() => { setEkleGun(gunlukPanelIndex); setFormKonu('') }} className="btn-hover" style={{ ...compactActionStyle, background:tema.card, border:`1px solid ${tema.border}`, color:tema.muted }}>
                    <Plus {...iconProps} /> görev ekle
                  </button>
                </div>
                {ekleGun === gunlukPanelIndex && (
                  <div className="slide-in" style={{ padding:'14px 12px', border:`1px solid ${tema.border}`, borderRadius:12, background:tema.cardSoft, display:'flex', flexDirection:'column', gap:10 }}>
                    <input autoFocus value={formKonu} onChange={e => setFormKonu(e.target.value)} onKeyDown={e => { if(e.key==='Enter') ekle(); if(e.key==='Escape') setEkleGun(null); }} placeholder="ne çalışacaksın?..."
                      style={{ background:tema.card, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.text, fontSize:15, padding:'14px 14px', outline:'none', width:'100%', boxSizing:'border-box' }} />
                    <select value={formDers} onChange={e => formDersDegistir(e.target.value)} style={{ fontSize:13, padding:'12px 12px', background:tema.card, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, width:'100%', boxSizing:'border-box', appearance:'none', WebkitAppearance:'none' }}>
                      {DERSLER.map(d => <option key={d}>{d}</option>)}
                    </select>
                    {renderKaynakSecici()}
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => setEkleGun(null)} className="btn-hover" style={{ ...modalActionStyle, flex:1, fontSize:13, padding:'12px 0', background:tema.card, border:`1px solid ${tema.border}`, color:tema.faint }}><X {...iconProps} /> iptal</button>
                      <button onClick={ekle} className="btn-hover" style={{ ...modalActionStyle, flex:1, fontSize:13, padding:'12px 0', background:tema.primary, border:'none', color:tema.onPrimary }}><Plus {...iconProps} /> ekle</button>
                    </div>
                  </div>
                )}
                {seciliGunGorevleri.length === 0 ? (
                  <div style={{ padding:'28px 20px', border:`1px dashed ${tema.border}`, borderRadius:14, color:tema.faint, textAlign:'center' }}>Bu güne görev eklenmemiş.</div>
                ) : seciliGunGorevleri.map(g => {
                  const renk = getDersRengi(g.ders, tema.mode)
                  const gs = g.gercek_sure || 0
                  return (
                    <div key={g.id} className="gorev-card" style={{ padding:'13px 12px 12px', border:`1px solid ${tema.border}`, borderRadius:12, background: g.tamam ? tema.cardSoft : tema.card, opacity:g.tamam ? 0.55 : 1, position:'relative', overflow:'hidden' }}>
                      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:renk, borderRadius:'3px 0 0 3px' }} />
                      <div style={{ paddingLeft:12 }}>
                        <p onClick={() => { if (!g.tamam) detayAc(g) }} style={{ margin:'0 0 3px', fontSize:11, color:renk, fontWeight:800, cursor:'pointer' }}>{g.ders}</p>
                        <p onClick={() => { if (!g.tamam) detayAc(g) }} style={{ margin:'0 0 8px', fontSize:13, color:g.tamam ? tema.faint : tema.text, textDecoration:g.tamam ? 'line-through' : 'none', lineHeight:1.45, fontWeight:600, cursor:'pointer' }}>{g.konu}</p>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                          <span style={{ fontSize:11, color:tema.faint, fontWeight:600 }}>{gs > 0 ? `${gs}dk` : '—'}</span>
                          <div style={{ display:'flex', gap:5 }}>
                            <button onClick={() => tickla(g)} className="btn-hover icon-only" title={g.tamam ? 'tamamlandı' : 'tamamla'} aria-label={g.tamam ? 'görev tamamlandı' : 'görevi tamamla'} style={{ width:24, height:24, borderRadius:7, border:g.tamam ? 'none' : `2px solid ${tema.border}`, background:g.tamam ? renk : 'transparent', color:g.tamam ? '#000' : tema.faint, cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}>{g.tamam && <Check size={13} strokeWidth={2.4} />}</button>
                            <button onClick={() => sil(g.id)} className="btn-hover icon-only task-action task-action-delete" title="sil" aria-label="görevi sil" style={{ width:24, height:24, borderRadius:7, background:'transparent', border:'none', color:tema.faint, cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Trash2 size={14} strokeWidth={2.1} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ padding:'16px', border:`1px solid ${tema.border}`, borderRadius:14, background:tema.card }}>
                  <p style={{ margin:'0 0 12px', fontSize:13, color:tema.textStrong, fontWeight:800, display:'inline-flex', alignItems:'center', gap:7 }}><BookOpen size={14} strokeWidth={2.1} /> Hazırlık</p>
                  {seciliGunKaynaklari.length === 0 ? (
                    <p style={{ margin:0, fontSize:12, color:tema.faint }}>Bu günün görevlerine kaynak bağlanmamış.</p>
                  ) : kaynakGorunumu === 'visual' ? (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:8 }}>
                      {seciliGunKaynaklari.map(kaynak => (
                        <div key={kaynak.id} style={{ border:`1px solid ${tema.border}`, borderRadius:12, background:tema.cardSoft, overflow:'hidden' }}>
                          {renderKaynakKapak(kaynak)}
                          <p style={{ margin:0, padding:'8px 9px', fontSize:10, color:tema.text, fontWeight:700, lineHeight:1.35 }}>{kaynak.ad}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {seciliGunKaynaklari.map(kaynak => (
                        <div key={kaynak.id} style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 10px', border:`1px solid ${tema.border}`, borderRadius:10, background:tema.cardSoft }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:getDersRengi(kaynak.ders, tema.mode), flex:'0 0 auto' }} />
                          <span style={{ fontSize:12, color:tema.text, fontWeight:700 }}>{kaynak.ad}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ padding:'16px', border:`1px solid ${tema.border}`, borderRadius:14, background:tema.card }}>
                  <p style={{ margin:'0 0 12px', fontSize:13, color:tema.textStrong, fontWeight:800, display:'inline-flex', alignItems:'center', gap:7 }}><NotebookPen size={14} strokeWidth={2.1} /> Günün notu</p>
                  <textarea value={notInput} onChange={e => setNotInput(e.target.value)} placeholder="bugün için kısa not..."
                    style={{ width:'100%', minHeight:92, resize:'vertical', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:12, color:tema.text, fontSize:13, padding:'12px 13px', outline:'none', boxSizing:'border-box', fontFamily:font.family, lineHeight:1.5 }} />
                  <button onClick={() => gunlukNotEkle(seciliGunTarihId)} className="btn-hover" style={{ ...compactActionStyle, width:'100%', marginTop:10, background:tema.primary, border:'none', color:tema.onPrimary }}>
                    <Save {...iconProps} /> notu kaydet
                  </button>
                  {seciliGunNotlari.length > 0 && (
                    <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
                      {seciliGunNotlari.slice(0, 3).map(not => (
                        <div key={not.id} style={{ padding:'10px 11px', border:`1px solid ${tema.border}`, borderRadius:10, background:tema.cardSoft }}>
                          <p style={{ margin:0, fontSize:12, color:tema.text, lineHeight:1.45, whiteSpace:'pre-wrap' }}>{not.icerik}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Başlık + nav */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(160px, 1fr) minmax(320px, auto) minmax(160px, 1fr)', alignItems:'start', marginBottom:'1rem', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:isMobile ? 'center' : 'flex-start', gap:8, flexWrap:'wrap', order: isMobile ? 1 : 0 }}>
          <button data-tour="tema-toggle" onClick={() => setAktifTema(seciliTema.pairedThemeKey)} className="btn-hover" aria-label={tema.mode === 'dark' ? 'light moda geç' : 'dark moda geç'} title={tema.mode === 'dark' ? 'Light moda geç' : 'Dark moda geç'} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10, padding:'6px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:7, color:tema.muted, cursor:'pointer', fontWeight:700 }}>
            {tema.mode === 'dark' ? <Sun size={12} strokeWidth={2.1} /> : <Moon size={12} strokeWidth={2.1} />} {tema.mode === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button data-tour="kaynaklar" onClick={() => setKaynaklarAcik(true)} className="btn-hover" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10, padding:'6px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:7, color:tema.muted, cursor:'pointer', fontWeight:600 }}>
            <BookOpen size={12} strokeWidth={2.1} /> Kaynaklarım
          </button>
          <button data-tour="notlar" onClick={() => setNotlarAcik(true)} className="btn-hover" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10, padding:'6px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:7, color:tema.muted, cursor:'pointer', fontWeight:600 }}>
            <Archive size={12} strokeWidth={2.1} /> Notlar
          </button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:12, order: isMobile ? 0 : 0 }}>
          <div>
            <p style={{ margin:0, fontSize:11, color:tema.primaryLight, letterSpacing:1.8, textTransform:'uppercase', fontWeight:700 }}>2026 YKS</p>
            <h1 style={{ margin:'4px 0 0', fontSize: isMobile ? 22 : 24, fontWeight:700, color:tema.textStrong, letterSpacing:0 }}>Haftalık Program</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
            <button onClick={() => { setGunOffset(o => o-1); }} className="btn-hover icon-only" aria-label="önceki gün" title="önceki gün" style={iconButtonStyle}><ChevronLeft size={16} strokeWidth={2.2} /></button>
            <div style={{ textAlign:'center', minWidth:118 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color: gunOffset===0 ? tema.primary:tema.text }}>
                {gunOffset===0 ? 'bu hafta' : gunOffset>0 ? `+${gunOffset} gün` : `${gunOffset} gün`}
              </p>
              <p style={{ margin:'4px 0 0', fontSize:11, color:tema.faint }}>{formatHafta(gunOffset)}</p>
            </div>
            <button onClick={() => { setGunOffset(o => o+1); }} className="btn-hover icon-only" aria-label="sonraki gün" title="sonraki gün" style={iconButtonStyle}><ChevronRight size={16} strokeWidth={2.2} /></button>
            <div style={{ width:76, height:34, display:'flex', alignItems:'center', justifyContent:'flex-start' }}>
              <button onClick={() => setGunOffset(0)} className="btn-hover" style={{ visibility: gunOffset !== 0 ? 'visible' : 'hidden', pointerEvents: gunOffset !== 0 ? 'auto' : 'none', background:tema.primary, border:'none', borderRadius:8, color:tema.onPrimary, cursor:'pointer', fontSize:10, fontWeight:700, padding:'0 10px', height:30, lineHeight:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:5, whiteSpace:'nowrap' }}><CalendarDays size={11} strokeWidth={2.1} /> bugün</button>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:isMobile ? 'center' : 'flex-end', gap:8, order: isMobile ? 2 : 0 }}>
          {user ? (
            <button onClick={handleLogout} className="btn-hover" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10, padding:'6px 12px', background:tema.cardSoft, border:`1px solid ${tema.border}`, borderRadius:7, color:tema.faint, cursor:'pointer', fontWeight:600 }}><LogOut size={12} strokeWidth={2.1} /> çıkış</button>
          ) : (
            <button onClick={() => { setAuthModal(true); setAuthMode('login'); setAuthError(''); }} className="btn-hover" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10, padding:'6px 12px', background:tema.primary, border:'none', borderRadius:7, color:tema.onPrimary, cursor:'pointer', fontWeight:600 }}><LogIn size={12} strokeWidth={2.1} /> giriş yap</button>
          )}
          <button onClick={() => setAyarlarAcik(true)} className="btn-hover icon-only" aria-label="ayarlar" title="ayarlar" style={iconButtonStyle}><Settings size={15} strokeWidth={2.1} /></button>
        </div>
      </div>

      {/* İlerleme */}
      <div style={{ background:tema.card, borderRadius:14, padding: isMobile ? '16px' : '18px 20px', marginBottom:'1rem', border:`1px solid ${tema.border}`, boxShadow:'none', display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(260px, 1.05fr) minmax(420px, 1.6fr)', alignItems:'center', gap: isMobile ? 16 : 24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`conic-gradient(${tema.primary} ${yuzde * 3.6}deg, ${tema.border} 0deg)`, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto', boxShadow:`0 0 0 1px ${tema.border}` }}>
            <div style={{ width:54, height:54, borderRadius:'50%', background:tema.card, display:'flex', alignItems:'center', justifyContent:'center', color:tema.textStrong, fontSize:15, fontWeight:800 }}>
              {yuzde}%
            </div>
          </div>
          <div style={{ minWidth:0, flex:1 }}>
            <p style={{ margin:'0 0 5px', fontSize:13, color:tema.textStrong, fontWeight:700, display:'inline-flex', alignItems:'center', gap:7 }}><CheckCircle2 size={14} strokeWidth={2.1} /> Haftalık ilerleme</p>
            <p style={{ margin:'0 0 10px', fontSize:12, color:tema.muted }}>{toplamTamam} / {aktifGorevler.length} görev tamamlandı</p>
            <div style={{ width:'100%', maxWidth:340, height:5, background:tema.border, borderRadius:99, overflow:'hidden' }}>
              <div className="progress-bar" style={{ height:'100%', width:`${yuzde}%`, background:`linear-gradient(90deg, ${tema.primary}, ${tema.accent})`, borderRadius:99 }} />
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap:0, borderLeft: isMobile ? 'none' : `1px solid ${tema.border}` }}>
          {[
            ['Toplam Görev', aktifGorevler.length, tema.textStrong],
            ['Tamamlanan', toplamTamam, tema.primaryLight],
            ['Kalan', kalanGorev, '#f87171'],
            ['Ortalama Süre', ortalamaSure ? formatSure(ortalamaSure) : '-', tema.textStrong],
          ].map(([label, value, color], index) => (
            <div key={label} style={{ padding: isMobile ? '10px 8px' : '4px 18px', borderLeft: !isMobile && index > 0 ? `1px solid ${tema.border}` : 'none', borderTop: isMobile && index > 1 ? `1px solid ${tema.border}` : 'none', textAlign:'center' }}>
              <p style={{ margin:'0 0 8px', fontSize:10, color:tema.muted, fontWeight:600 }}>{label}</p>
              <p style={{ margin:0, fontSize: isMobile ? 18 : 20, color:color as string, fontWeight:800 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hızlı aksiyonlar */}
      <div style={{ marginBottom:'1rem', display:'flex', gap:8, flexWrap:'wrap' }}>
        <button onClick={() => setTopluAcik(v => !v)} className="btn-hover" style={{ ...compactActionStyle, background: topluAcik?tema.primary:tema.card, border:`1px solid ${topluAcik ? tema.primary : tema.border}`, color: topluAcik?tema.onPrimary:tema.muted }}>
          {topluAcik ? <X {...iconProps} /> : <ListPlus {...iconProps} />}{topluAcik ? 'kapat' : 'toplu görev ekle'}
        </button>
        <button onClick={openBitmeyenPanel} disabled={bitmeyenSayisi === 0} className="btn-hover" style={{ ...compactActionStyle, background: bitmeyenAcik?tema.primary:tema.card, border:`1px solid ${bitmeyenAcik ? tema.primary : tema.border}`, color: bitmeyenAcik?tema.onPrimary:tema.muted, cursor: bitmeyenSayisi === 0 ? 'not-allowed' : 'pointer', opacity: bitmeyenSayisi === 0 ? 0.45 : 1 }}>
          {bitmeyenAcik ? <X {...iconProps} /> : <MoveRight {...iconProps} />}{bitmeyenAcik ? 'kapat' : `bitmeyenleri taşı (${bitmeyenSayisi})`}
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
            <button onClick={() => setBitmeyenAcik(false)} className="btn-hover" style={{ ...modalActionStyle, fontSize:13, padding:'12px 20px', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.faint }}><X {...iconProps} /> iptal</button>
            <button onClick={bitmeyenleriTasi} disabled={tasinabilirSayisi === 0} className="btn-hover" style={{ ...modalActionStyle, fontSize:13, padding:'12px 20px', background:tema.primary, border:'none', color:tema.onPrimary, cursor: tasinabilirSayisi === 0 ? 'not-allowed' : 'pointer', opacity: tasinabilirSayisi === 0 ? 0.55 : 1 }}>
              <MoveRight {...iconProps} /> taşı
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
            <button onClick={() => setTopluAcik(false)} className="btn-hover" style={{ ...modalActionStyle, fontSize:13, padding:'12px 20px', background:tema.cardSoft, border:`1px solid ${tema.border}`, color:tema.faint }}><X {...iconProps} /> iptal</button>
            <button onClick={topluEkle} className="btn-hover" style={{ ...modalActionStyle, fontSize:13, padding:'12px 20px', background:tema.primary, border:'none', color:tema.onPrimary }}>
              <Plus {...iconProps} /> ekle ({seciliGunler.length} gün)
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
              data-gun-index={i}
              className={`fade-in day-column ${isDragOver || kopyaDrag ? 'drag-over' : ''}`} 
              onClickCapture={(e) => {
                if (!kopyaDrag) return
                e.preventDefault()
                e.stopPropagation()
                gorevCogalt(i)
              }}
              style={{ display:'flex', flexDirection:'column', gap:6, animationDelay:`${i * 0.05}s`, animationFillMode:'both', minWidth: isMobile ? '120px' : 'auto', padding: isDragOver || kopyaDrag ? '8px 4px' : '0', cursor: kopyaDrag ? 'copy' : 'default' }}
            >
              {/* Gün başlığı */}
              <button
                type="button"
                onClick={() => setGunlukPanelIndex(i)}
                className="btn-hover"
                data-tour={i === 0 ? 'gunluk' : undefined}
                aria-label={`${gunBilgisi.label} günlük görünümü aç`}
                style={{ padding:'8px 6px', borderRadius:10, background: isBugun?`linear-gradient(135deg, ${tema.primary}, ${tema.primaryLight})`:tema.card, border: isBugun?'none':`1px solid ${tema.border}`, textAlign:'center', marginBottom:2, cursor:'pointer', width:'100%' }}
              >
                <p style={{ margin:0, fontSize:11, fontWeight:600, color: isBugun?tema.onPrimary:tema.muted, letterSpacing:0.5 }}>{gunBilgisi.label}</p>
                {gunGorevler.length > 0 && (
                  <p style={{ margin:'3px 0 0', fontSize:10, color: isBugun?tema.onPrimary: tamam===gunGorevler.length?tema.primaryLight:tema.faint, fontWeight: isBugun ? 500 : 400 }}>{tamam}/{gunGorevler.length}</p>
                )}
              </button>

              {/* Toplam çalışma süresi */}
              {gunToplamSure > 0 && (
                <div style={{ padding:'6px 8px', borderRadius:8, background:`${tema.primary}15`, border:`1px solid ${tema.primary}30`, textAlign:'center' }}>
                  <p style={{ margin:0, fontSize:10, color:tema.primaryLight, fontWeight:600, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:5 }}><Clock size={11} strokeWidth={2.1} /> {formatSure(gunToplamSure)}</p>
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
                    onPointerDown={(e) => handlePointerDragStart(e, g)}
                    onClickCapture={(e) => {
                      if (!dragClickEngelleRef.current) return
                      e.preventDefault()
                      e.stopPropagation()
                      dragClickEngelleRef.current = false
                    }}
                    onClick={(e) => {
                      if (g.tamam || dragClickEngelleRef.current) return
                      const target = e.target as HTMLElement
                      if (target.closest('button, input, select, textarea')) return
                      detayAc(g)
                    }}
                    style={{ padding:'10px 8px 9px', border:`1px solid ${tema.border}`, borderRadius:10, background: g.tamam ? tema.cardSoft : tema.card, opacity: g.tamam?0.5:(isDragging?0.5:1), position:'relative', overflow:'hidden', cursor: g.tamam ? 'default' : 'grab' }}
                  >
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:renk, borderRadius:'3px 0 0 3px' }} />
                    <div style={{ paddingLeft:10 }}>
                      <p style={{ margin:'0 0 2px', fontSize:10, color:renk, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', cursor:'pointer' }}>{g.ders}</p>
                      <p style={{ margin:'0 0 6px', fontSize:11, color: g.tamam?tema.faint:tema.text, textDecoration: g.tamam?'line-through':'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.4, fontWeight: g.tamam ? 400 : 500, cursor:'pointer' }}>{g.konu}</p>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:10, color:tema.faint, fontWeight:500 }}>{gs > 0 ? `${gs}dk` : '—'}</span>
                        <div style={{ display:'flex', gap:4 }}>
                          <button onClick={() => tickla(g)} className="btn-hover icon-only" title={g.tamam ? 'tamamlandı' : 'tamamla'} aria-label={g.tamam ? 'görev tamamlandı' : 'görevi tamamla'} style={{ width:19, height:19, borderRadius:6, border: g.tamam?'none':`2px solid ${tema.border}`, background: g.tamam?renk:'transparent', color:g.tamam?'#000':tema.faint, cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {g.tamam && <Check size={11} strokeWidth={2.4} />}
                          </button>
                          <button onMouseDown={(e) => { e.preventDefault(); e.stopPropagation() }} onClick={(e) => kopyaBaslat(g, e)} draggable={false} className="btn-hover icon-only task-action task-action-copy" title="çoğalt" aria-label="görevi çoğalt" style={{ width:20, height:20, borderRadius:6, background:'transparent', border:'none', color:tema.faint, cursor:'copy', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Copy size={13} strokeWidth={2.1} /></button>
                          <button onClick={() => sil(g.id)} className="btn-hover icon-only task-action task-action-delete" title="sil" aria-label="görevi sil" style={{ width:20, height:20, borderRadius:6, background:'transparent', border:'none', color:tema.faint, cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center' }}><Trash2 size={13} strokeWidth={2.1} /></button>
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
                  <select value={formDers} onChange={e => formDersDegistir(e.target.value)} style={{ fontSize:13, padding:'12px 12px', background:tema.card, border:`1px solid ${tema.border}`, borderRadius:10, color:tema.muted, width:'100%', boxSizing:'border-box', appearance:'none', WebkitAppearance:'none' }}>
                    {DERSLER.map(d => <option key={d}>{d}</option>)}
                  </select>
                  {renderKaynakSecici()}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setEkleGun(null)} className="btn-hover" style={{ ...modalActionStyle, flex:1, fontSize:13, padding:'12px 0', background:tema.card, border:`1px solid ${tema.border}`, color:tema.faint }}><X {...iconProps} /> iptal</button>
                    <button onClick={ekle} className="btn-hover" style={{ ...modalActionStyle, flex:1, fontSize:13, padding:'12px 0', background:tema.primary, border:'none', color:tema.onPrimary }}><Plus {...iconProps} /> ekle</button>
                  </div>
                </div>
              ) : (
                <button data-tour={i === 0 ? 'gorev-ekle' : undefined} onClick={() => { setEkleGun(i); setFormKonu(''); }} className="btn-hover" aria-label={`${gunBilgisi.label} gününe görev ekle`} style={{ width:'100%', padding:'14px 0', fontSize:20, cursor: kopyaDrag ? 'copy' : 'pointer', border:`2px dashed ${tema.border}`, borderRadius:12, background:'transparent', color:tema.faint, fontWeight:300, display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={19} strokeWidth={2.1} /></button>
              )}
            </div>
          )
        })}
      </div>

      {/* İşlem bildirimi */}
      {kopyaDrag && (
        <>
          <div style={{ position:'fixed', top:18, left:'50%', transform:'translateX(-50%)', zIndex:3000, background:tema.primary, border:`1px solid ${tema.primaryLight}`, color:tema.onPrimary, padding:'11px 16px', borderRadius:12, fontSize:12, fontWeight:700, boxShadow:tema.shadow, pointerEvents:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
            <Copy size={14} strokeWidth={2.2} /> hedef güne tıkla · boşluğa tıkla veya Esc ile iptal
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
