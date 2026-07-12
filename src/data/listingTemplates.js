import { CATEGORIES, THEMES } from './products.js'

const catLabel = (cat) => cat === 'All Three' ? 'Stevie, Bridget & Jewels' : cat

const getCategoryLabel = (id) => CATEGORIES.find(c => c.id === id)?.label ?? id
const getThemeLabel = (id) => THEMES.find(t => t.id === id)?.label ?? id

const CATEGORY_BUYER_TAGS = {
  mugs:    ['cat mom gift', 'cat dad gift', 'cat lover gift', 'cat owner gift', 'maine coon lover'],
  apparel: ['cat mom shirt', 'cat dad gift', 'cat lover gift', 'maine coon lover', 'cat owner gift'],
  prints:  ['cat wall art', 'cat lover gift', 'cat art print', 'maine coon lover', 'cat mom gift'],
  stickers:['cat sticker', 'cat lover gift', 'laptop sticker', 'cat mom gift', 'waterproof sticker'],
  totes:   ['cat tote bag', 'cat lover gift', 'cat mom tote', 'reusable bag', 'cat owner gift'],
  home:    ['cat home decor', 'cat lover gift', 'cat room decor', 'maine coon decor', 'cat mom gift'],
}

const CATEGORY_PRODUCT_TAGS = {
  mugs:    ['coffee mug', 'maine coon mug', 'cat mug', 'funny cat mug', 'travel mug'],
  apparel: ['maine coon shirt', 'cat shirt', 'maine coon tee', 'cat hoodie', 'graphic tee'],
  prints:  ['maine coon print', 'cat art print', 'cat poster', 'maine coon poster', 'digital print'],
  stickers:['maine coon sticker', 'cat sticker set', 'vinyl sticker', 'cat decal', 'sticker pack'],
  totes:   ['cat canvas tote', 'maine coon bag', 'cat market bag', 'cat tote bag', 'canvas bag'],
  home:    ['cat throw pillow', 'maine coon pillow', 'cat pillow cover', 'cat home gift', 'cat blanket'],
}

const THEME_TAGS = {
  'van-life':    ['van life', 'road trip cat', 'travel cat', 'adventure cat', 'van life cat'],
  'sunsets':     ['sunset cat', 'golden hour', 'sunset lover', 'nature lover', 'sunset art'],
  'new-orleans': ['new orleans cat', 'jazz cat', 'nola cat', 'jazz lover', 'bourbon street'],
  'adventure':   ['adventure cat', 'explorer cat', 'wanderlust cat', 'travel lover', 'hiking cat'],
  'coastal':     ['coastal cat', 'ocean cat', 'beach cat', 'nautical cat', 'coastal decor'],
  'cozy':        ['cozy cat', 'cottagecore cat', 'cat cottage', 'hygge cat', 'cozy home'],
}

const THEME_DESCRIPTORS = {
  'van-life':    'van life and road trip adventures',
  'sunsets':     'chasing golden sunsets',
  'new-orleans': 'the jazz and soul of New Orleans',
  'adventure':   'exploring everywhere with wild curiosity',
  'coastal':     'coastal breezes and New England charm',
  'cozy':        'cozy cottagecore vibes and quiet naps',
}

const CATEGORY_DETAILS = {
  mugs: `PRODUCT DETAILS
• Available in 11oz and 15oz
• Ceramic, dishwasher safe (top rack recommended)
• Microwave safe
• Vibrant, fade-resistant printing
• Ships from the US via Printify`,

  apparel: `PRODUCT DETAILS
• Unisex sizing (size chart in photos)
• Soft, premium cotton blend
• Machine washable — wash inside out for best results
• Printed with vibrant, long-lasting ink
• Ships from the US via Printify`,

  prints: `PRODUCT DETAILS
• Available in multiple sizes (see dropdown)
• Printed on premium matte or glossy paper
• Ships in a protective flat mailer or tube
• Frame not included
• Ships from the US via Printify`,

  stickers: `PRODUCT DETAILS
• Premium vinyl, waterproof and weather-resistant
• Glossy finish
• Great for laptops, water bottles, journals, and more
• Ships in a protective sleeve
• Ships from the US via Printify`,

  totes: `PRODUCT DETAILS
• Sturdy canvas construction
• Approximately 15" x 15" with 20" handles
• Machine washable
• Printed with fade-resistant ink
• Ships from the US via Printify`,

  home: `PRODUCT DETAILS
• Premium quality fabric, pillow insert sold separately
• Hidden zipper closure
• Machine washable cover
• Vibrant, durable print
• Ships from the US via Printify`,
}

function pickTags(category, theme) {
  const product = [...(CATEGORY_PRODUCT_TAGS[category] ?? [])].slice(0, 4)
  const buyer = [...(CATEGORY_BUYER_TAGS[category] ?? [])].slice(0, 4)
  const themeT = [...(THEME_TAGS[theme] ?? [])].slice(0, 3)
  const base = ['maine coon cat', 'maine coon gift']

  const all = [...product, ...buyer, ...themeT, ...base]
  const unique = [...new Set(all)].slice(0, 13)
  return unique
}

export function generateListing(product) {
  const { name, category, cat, theme, description: designNotes, suggestedPrice } = product
  const catName = catLabel(cat)
  const themeDesc = THEME_DESCRIPTORS[theme] ?? 'the open road'
  const catLabel2 = cat === 'All Three' ? 'these three fluffy adventurers' : catName

  const titles = [
    `${name} | Maine Coon ${getCategoryLabel(category)} | Traveling Cat Gift | Cat Lover Gift`,
    `Maine Coon ${getCategoryLabel(category)} | ${name} | ${getThemeLabel(theme)} Cat Gift | Cat Mom Gift`,
    `${name} | Funny Maine Coon Gift | Cat Lover ${getCategoryLabel(category)} | ${getThemeLabel(theme)} Gift`,
  ].map(t => t.slice(0, 140))

  const bodyDescription = `Meet ${catName} — the fluffiest, most adventurous Maine Coon${cat === 'All Three' ? 's' : ''} on the road.

This ${getCategoryLabel(category).toLowerCase()} is inspired by real life travels with ${catLabel2}, who ${themeDesc === 'the open road' ? 'love every mile of the open road' : `love ${themeDesc}`}.

${designNotes || `A beautiful, unique design that captures the spirit of ${catName} and the places they roam.`}

Whether you're a Maine Coon lover, a van life enthusiast, or just someone who gets it — this is made for you.

${CATEGORY_DETAILS[category] || ''}

MAKES A GREAT GIFT FOR:
• Maine Coon cat parents
• Cat moms and cat dads
• Van life and road trip fans
• Travel lovers who also love cats
• Anyone who follows the Traveling Maine Coons

All designs by Traveling Maine Coons. ${catName} approve${cat !== 'All Three' ? 's' : ''} this message. 🐾

Ships fast! Questions? Message me anytime — I love hearing from fellow cat people.`

  const tags = pickTags(category, theme)

  return { titles, description: bodyDescription, tags }
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}
