export type TemaMode = 'dark' | 'light'
export type PaletKey = 'american' | 'aussie' | 'british' | 'canadian' | 'turkish' | 'indian'

export interface PaletRengi {
  name: string
  hex: string
}

export interface Palet {
  key: PaletKey
  name: string
  colors: PaletRengi[]
  darkBase: [string, string]
  lightBase: [string, string]
  accentIndexes: number[]
  secondaryIndexes: number[]
}

export interface Tema {
  name: string
  mode: TemaMode
  palette: PaletKey
  paletteName: string
  index: number
  pairedThemeKey: string
  swatches: string[]
  primary: string
  primaryLight: string
  accent: string
  bg: string
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

const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)))

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b].map(value => clamp(value).toString(16).padStart(2, '0')).join('')}`

const mixHex = (from: string, to: string, amount: number) => {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  })
}

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex)
  const linear = [r, g, b].map(value => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

const readableText = (bg: string) => luminance(bg) > 0.48 ? '#0b1220' : '#ffffff'

export const PALET_SIRASI: PaletKey[] = ['american', 'aussie', 'british', 'canadian', 'turkish', 'indian']

export const PALETLER: Record<PaletKey, Palet> = {
  american: {
    key: 'american',
    name: 'American',
    darkBase: ['#192a56', '#2f3640'],
    lightBase: ['#f5f6fa', '#dcdde1'],
    accentIndexes: [0, 1, 2, 3, 5, 9],
    secondaryIndexes: [3, 0, 1, 2, 8, 6],
    colors: [
      { name: 'Protoss Pylon', hex: '#00a8ff' },
      { name: 'Periwinkle', hex: '#9c88ff' },
      { name: 'Rise-N-Shine', hex: '#fbc531' },
      { name: 'Download Progress', hex: '#4cd137' },
      { name: 'Seabrook', hex: '#487eb0' },
      { name: 'Vanadyl Blue', hex: '#0097e6' },
      { name: 'Matt Purple', hex: '#8c7ae6' },
      { name: 'Nanohanacha Gold', hex: '#e1b12c' },
      { name: 'Skirret Green', hex: '#44bd32' },
      { name: 'Naval', hex: '#40739e' },
      { name: 'Nasturcian Flower', hex: '#e84118' },
      { name: 'Lynx White', hex: '#f5f6fa' },
      { name: 'Blueberry Soda', hex: '#7f8fa6' },
      { name: 'Mazarine Blue', hex: '#273c75' },
      { name: 'Blue Nights', hex: '#353b48' },
      { name: 'Harley Davidson Orange', hex: '#c23616' },
      { name: 'Hint of Pensive', hex: '#dcdde1' },
      { name: 'Chain Gang Grey', hex: '#718093' },
      { name: 'Pico Void', hex: '#192a56' },
      { name: 'Electromagnetic', hex: '#2f3640' },
    ],
  },
  aussie: {
    key: 'aussie',
    name: 'Aussie',
    darkBase: ['#130f40', '#535c68'],
    lightBase: ['#dff9fb', '#c7ecee'],
    accentIndexes: [1, 2, 3, 4, 11, 16],
    secondaryIndexes: [9, 7, 8, 13, 14, 10],
    colors: [
      { name: 'Beekeeper', hex: '#f6e58d' },
      { name: 'Spiced Nectarine', hex: '#ffbe76' },
      { name: 'Pink Glamour', hex: '#ff7979' },
      { name: 'June Bud', hex: '#badc58' },
      { name: 'Coastal Breeze', hex: '#dff9fb' },
      { name: 'Turbo', hex: '#f9ca24' },
      { name: 'Quince Jelly', hex: '#f0932b' },
      { name: 'Carmine Pink', hex: '#eb4d4b' },
      { name: 'Pure Apple', hex: '#6ab04c' },
      { name: 'Hint of Ice Pack', hex: '#c7ecee' },
      { name: 'Middle Blue', hex: '#7ed6df' },
      { name: 'Heliotrope', hex: '#e056fd' },
      { name: 'Exodus Fruit', hex: '#686de0' },
      { name: 'Deep Koamaru', hex: '#30336b' },
      { name: 'Soaring Eagle', hex: '#95afc0' },
      { name: 'Greenland Green', hex: '#22a6b3' },
      { name: 'Steel Pink', hex: '#be2edd' },
      { name: 'Blurple', hex: '#4834d4' },
      { name: 'Deep Cove', hex: '#130f40' },
      { name: 'Wizard Grey', hex: '#535c68' },
    ],
  },
  british: {
    key: 'british',
    name: 'British',
    darkBase: ['#2d3436', '#636e72'],
    lightBase: ['#dfe6e9', '#b2bec3'],
    accentIndexes: [0, 2, 3, 8, 12, 18],
    secondaryIndexes: [6, 7, 13, 10, 15, 11],
    colors: [
      { name: 'Light Greenish Blue', hex: '#55efc4' },
      { name: 'Faded Poster', hex: '#81ecec' },
      { name: 'Green Darner Tail', hex: '#74b9ff' },
      { name: 'Shy Moment', hex: '#a29bfe' },
      { name: 'City Lights', hex: '#dfe6e9' },
      { name: 'Mint Leaf', hex: '#00b894' },
      { name: 'Robins Egg Blue', hex: '#00cec9' },
      { name: 'Electron Blue', hex: '#0984e3' },
      { name: 'Exodus Fruit', hex: '#6c5ce7' },
      { name: 'Soothing Breeze', hex: '#b2bec3' },
      { name: 'Sour Lemon', hex: '#ffeaa7' },
      { name: 'First Date', hex: '#fab1a0' },
      { name: 'Pink Glamour', hex: '#ff7675' },
      { name: 'Pico-8 Pink', hex: '#fd79a8' },
      { name: 'American River', hex: '#636e72' },
      { name: 'Bright Yarrow', hex: '#fdcb6e' },
      { name: 'Orangeville', hex: '#e17055' },
      { name: 'Chi-Gong', hex: '#d63031' },
      { name: 'Prunus Avium', hex: '#e84393' },
      { name: 'Dracula Orchid', hex: '#2d3436' },
    ],
  },
  canadian: {
    key: 'canadian',
    name: 'Canadian',
    darkBase: ['#4b6584', '#778ca3'],
    lightBase: ['#d1d8e0', '#a5b1c2'],
    accentIndexes: [0, 1, 2, 3, 10, 12],
    secondaryIndexes: [4, 8, 6, 9, 11, 17],
    colors: [
      { name: 'Fusion Red', hex: '#fc5c65' },
      { name: 'Orange Hibiscus', hex: '#fd9644' },
      { name: 'Flirtatious', hex: '#fed330' },
      { name: 'Reptile Green', hex: '#26de81' },
      { name: 'Maximum Blue Green', hex: '#2bcbba' },
      { name: 'Desire', hex: '#eb3b5a' },
      { name: 'Beniukon Bronze', hex: '#fa8231' },
      { name: 'NYC Taxi', hex: '#f7b731' },
      { name: 'Algal Fuel', hex: '#20bf6b' },
      { name: 'Turquoise Topaz', hex: '#0fb9b1' },
      { name: 'High Blue', hex: '#45aaf2' },
      { name: 'C64 NTSC', hex: '#4b7bec' },
      { name: 'Lighter Purple', hex: '#a55eea' },
      { name: 'Twinkle Blue', hex: '#d1d8e0' },
      { name: 'Blue Grey', hex: '#778ca3' },
      { name: 'Boyzone', hex: '#2d98da' },
      { name: 'Royal Blue', hex: '#3867d6' },
      { name: 'Gloomy Purple', hex: '#8854d0' },
      { name: 'Innuendo', hex: '#a5b1c2' },
      { name: 'Blue Horizon', hex: '#4b6584' },
    ],
  },
  turkish: {
    key: 'turkish',
    name: 'Turkish',
    darkBase: ['#222f3e', '#576574'],
    lightBase: ['#c8d6e5', '#8395a7'],
    accentIndexes: [0, 1, 2, 3, 4, 12],
    secondaryIndexes: [5, 7, 9, 10, 11, 16],
    colors: [
      { name: 'Jigglypuff', hex: '#ff9ff3' },
      { name: 'Casandora Yellow', hex: '#feca57' },
      { name: 'Pastel Red', hex: '#ff6b6b' },
      { name: 'Megaman', hex: '#48dbfb' },
      { name: 'Wild Caribbean Green', hex: '#1dd1a1' },
      { name: 'Lian Hong Lotus Pink', hex: '#f368e0' },
      { name: 'Double Dragon Skin', hex: '#ff9f43' },
      { name: 'Amour', hex: '#ee5253' },
      { name: 'Cyanite', hex: '#0abde3' },
      { name: 'Dark Mountain Meadow', hex: '#10ac84' },
      { name: 'Jade Dust', hex: '#00d2d3' },
      { name: 'Joust Blue', hex: '#54a0ff' },
      { name: 'Nasunaga Grey', hex: '#5f27cd' },
      { name: 'Light Blue Ballerina', hex: '#c8d6e5' },
      { name: 'Fuel Town', hex: '#576574' },
      { name: 'Aqua Velvet', hex: '#01a3a4' },
      { name: 'Bleu De France', hex: '#2e86de' },
      { name: 'Bluebell', hex: '#341f97' },
      { name: 'Storm Petrel', hex: '#8395a7' },
      { name: 'Imperial Primer', hex: '#222f3e' },
    ],
  },
  indian: {
    key: 'indian',
    name: 'Indian',
    darkBase: ['#0c2461', '#0a3d62'],
    lightBase: ['#fad390', '#f8c291'],
    accentIndexes: [0, 2, 3, 4, 6, 9],
    secondaryIndexes: [5, 8, 10, 14, 11, 15],
    colors: [
      { name: 'Flat Flesh', hex: '#fad390' },
      { name: 'Melon Melody', hex: '#f8c291' },
      { name: 'Livid', hex: '#6a89cc' },
      { name: 'Spray', hex: '#82ccdd' },
      { name: 'Paradise Green', hex: '#b8e994' },
      { name: 'Squash Blossom', hex: '#f6b93b' },
      { name: 'Mandarin Red', hex: '#e55039' },
      { name: 'Azraq Blue', hex: '#4a69bd' },
      { name: 'Dupain', hex: '#60a3bc' },
      { name: 'Aurora Green', hex: '#78e08f' },
      { name: 'Iceland Poppy', hex: '#fa983a' },
      { name: 'Tomato Red', hex: '#eb2f06' },
      { name: 'Yue Guang Lan Blue', hex: '#1e3799' },
      { name: 'Good Samaritan', hex: '#3c6382' },
      { name: 'Waterfall', hex: '#38ada9' },
      { name: 'Carrot Orange', hex: '#e58e26' },
      { name: 'Jalapeno Red', hex: '#b71540' },
      { name: 'Dark Sapphire', hex: '#0c2461' },
      { name: 'Forest Blues', hex: '#0a3d62' },
      { name: 'Reef Encounter', hex: '#079992' },
    ],
  },
}

const createTema = (palet: Palet, mode: TemaMode, index: number): Tema => {
  const accentIndex = palet.accentIndexes[index - 1]
  const secondaryIndex = palet.secondaryIndexes[index - 1]
  const primary = palet.colors[accentIndex].hex
  const accent = palet.colors[secondaryIndex].hex
  const darkBg = mixHex(palet.darkBase[0], '#000000', 0.52)
  const darkCard = mixHex(palet.darkBase[1], '#02050a', 0.56)
  const darkCardSoft = mixHex(palet.darkBase[0], '#000000', 0.68)
  const lightBg = mixHex(palet.lightBase[0], '#ffffff', 0.62)
  const lightCard = mixHex(palet.lightBase[1], '#ffffff', 0.78)
  const lightCardSoft = mixHex(palet.lightBase[0], '#ffffff', 0.82)
  const pairedMode = mode === 'dark' ? 'light' : 'dark'

  if (mode === 'dark') {
    return {
      name: `${palet.name} Dark ${index}`,
      mode,
      palette: palet.key,
      paletteName: palet.name,
      index,
      pairedThemeKey: `${palet.key}-${pairedMode}-${index}`,
      swatches: [primary, accent, palet.darkBase[0], palet.darkBase[1], palet.lightBase[0], palet.lightBase[1]],
      primary,
      primaryLight: mixHex(primary, '#ffffff', 0.24),
      accent,
      bg: darkBg,
      card: darkCard,
      cardSoft: darkCardSoft,
      border: mixHex(palet.darkBase[1], '#9ca3af', 0.2),
      hoverBorder: mixHex(primary, '#ffffff', 0.18),
      text: '#e5e7eb',
      textStrong: '#f8fafc',
      muted: '#a7adb8',
      faint: '#6b7280',
      onPrimary: readableText(primary),
      success: accent,
      successText: readableText(accent),
      overlay: 'rgba(2,6,12,0.76)',
      shadow: `0 22px 64px ${mixHex(palet.darkBase[0], '#000000', 0.2)}99`,
      hoverShadow: '0 10px 26px rgba(0,0,0,0.28)',
    }
  }

  return {
    name: `${palet.name} Light ${index}`,
    mode,
    palette: palet.key,
    paletteName: palet.name,
    index,
    pairedThemeKey: `${palet.key}-${pairedMode}-${index}`,
    swatches: [primary, accent, palet.lightBase[0], palet.lightBase[1], palet.darkBase[0], palet.darkBase[1]],
    primary,
    primaryLight: mixHex(primary, '#000000', 0.08),
    accent,
    bg: lightBg,
    card: lightCard,
    cardSoft: lightCardSoft,
    border: mixHex(palet.lightBase[1], '#64748b', 0.22),
    hoverBorder: mixHex(primary, '#000000', 0.1),
    text: '#1f2937',
    textStrong: '#0f172a',
    muted: '#526072',
    faint: '#94a3b8',
    onPrimary: readableText(primary),
    success: mixHex(accent, '#16a34a', 0.18),
    successText: readableText(mixHex(accent, '#16a34a', 0.18)),
    overlay: 'rgba(15,23,42,0.34)',
    shadow: '0 20px 60px rgba(15,23,42,0.14)',
    hoverShadow: '0 8px 22px rgba(15,23,42,0.11)',
  }
}

export const TEMALAR: Record<string, Tema> = Object.fromEntries(
  PALET_SIRASI.flatMap(paletKey => {
    const palet = PALETLER[paletKey]
    return ([1, 2, 3, 4, 5, 6] as const).flatMap(index => [
      [`${palet.key}-dark-${index}`, createTema(palet, 'dark', index)],
      [`${palet.key}-light-${index}`, createTema(palet, 'light', index)],
    ])
  })
)

const LEGACY_TEMA_MAP: Record<string, string> = {
  mavi: 'american-dark-1',
  mor: 'british-dark-4',
  yesil: 'british-dark-1',
  kirmizi: 'canadian-dark-1',
  turuncu: 'aussie-dark-1',
  pembe: 'turkish-dark-1',
  sabah: 'aussie-light-1',
  gokyuzu: 'american-light-1',
  mint: 'british-light-1',
  lavanta: 'british-light-4',
  seftali: 'canadian-light-1',
  studio: 'american-light-6',
}

export const normalizeTemaKey = (key: string | null) => {
  if (key && TEMALAR[key]) return key
  if (key && LEGACY_TEMA_MAP[key]) return LEGACY_TEMA_MAP[key]
  return 'american-dark-1'
}
