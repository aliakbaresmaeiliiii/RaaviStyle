import { messages } from "./i18n/fa";

export type Product = {
  id: string;
  title: string;
  href: string;
  image: string;
  price: number;
  compareAt?: number;
  tone: string;
  colors: string[];
  sizes: string[];
  category: string;
  inStock: boolean;
};

const C = {
  black: "#1a1412",
  navy: "#1e3a5f",
  denim: "#3d5a80",
  lightDenim: "#7ba3c9",
  white: "#f5f1e8",
  cream: "#e4d5c3",
  olive: "#7e8774",
  gray: "#6b6b6b",
  charcoal: "#3a3a3a",
  brown: "#5c3d32",
  beige: "#d4c4b0",
  khaki: "#c3b091",
  stone: "#b8b09a",
  mocha: "#a47864",
};

export const categories = [
  { id: "bag", label: "بگ", icon: "fa-bag-shopping", href: "/products?cat=bag" },
  { id: "half-bag", label: "نیم‌بگ", icon: "fa-shirt", href: "/products?cat=half-bag" },
  { id: "mom", label: "مام‌استایل", icon: "fa-child", href: "/products?cat=mom" },
  { id: "straight", label: "راسته", icon: "fa-grip-lines", href: "/products?cat=straight" },
  { id: "wide", label: "وایدلگ", icon: "fa-arrows-left-right", href: "/products?cat=wide" },
  { id: "cargo", label: "کارگو", icon: "fa-box", href: "/products?cat=cargo" },
  { id: "skinny", label: "اسکینی", icon: "fa-person", href: "/products?cat=skinny" },
  { id: "bootcut", label: "بوت‌کات", icon: "fa-shoe-prints", href: "/products?cat=bootcut" },
  { id: "linen", label: "لینن", icon: "fa-leaf", href: "/products?cat=linen" },
  { id: "formal", label: "رسمی", icon: "fa-user-tie", href: "/products?cat=formal" },
];

export const colorFilters = [
  { id: "black", label: "مشکی", value: C.black },
  { id: "navy", label: "سرمه‌ای", value: C.navy },
  { id: "denim", label: "آبی جین", value: C.denim },
  { id: "light-denim", label: "آبی روشن", value: C.lightDenim },
  { id: "white", label: "سفید", value: C.white },
  { id: "cream", label: "کرم", value: C.cream },
  { id: "olive", label: "زیتونی", value: C.olive },
  { id: "gray", label: "طوسی", value: C.gray },
  { id: "charcoal", label: "زغالی", value: C.charcoal },
  { id: "brown", label: "قهوه‌ای", value: C.brown },
  { id: "beige", label: "بژ", value: C.beige },
  { id: "khaki", label: "خاکی", value: C.khaki },
];

export const sizeFilters = ["۳۶", "۳۸", "۴۰", "۴۲", "۴۴", "۴۶", "۴۸", "۲۹", "۳۰", "۳۱", "۳۲", "۳۳", "۳۴"];

const women = ["۳۶", "۳۸", "۴۰", "۴۲", "۴۴"];
const jeans = ["۲۹", "۳۰", "۳۱", "۳۲", "۳۳", "۳۴"];

const WIKI_CDN = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Laughing_woman_in_jean_jacket_%28Unsplash%29.jpg/960px-Laughing_woman_in_jean_jacket_%28Unsplash%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Close-Up_of_Denim_Jeans.jpg/960px-Close-Up_of_Denim_Jeans.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Skinny_Jeans_%28Unsplash%29.jpg/960px-Skinny_Jeans_%28Unsplash%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Young_woman_wearing_cargo_pants_and_crop_top_in_Madison%2C_Wisconsin_2021.jpg/960px-Young_woman_wearing_cargo_pants_and_crop_top_in_Madison%2C_Wisconsin_2021.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/a/ad/Young_woman_in_tank_top_and_high-rise_trousers%2C_Portugal_2010.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Young_woman_in_T-shirt_and_low-rise_cargo_pants%2C_tying_hair_back%2C_Italy_2010.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flared_trousers%2C_fashion_Fortepan_78123.jpg/960px-Flared_trousers%2C_fashion_Fortepan_78123.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Blauwe_jeans%2C_skinny_jeans_model%2C_merk_Revers_Jeans%2C_maat_S36%2C_objectnr_86974-3%281%29.JPG/960px-Blauwe_jeans%2C_skinny_jeans_model%2C_merk_Revers_Jeans%2C_maat_S36%2C_objectnr_86974-3%281%29.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Blauwe_jeans%2C_skinny_jeans_model%2C_merk_Revers_Jeans%2C_maat_S36%2C_objectnr_86974-3%282%29.JPG/960px-Blauwe_jeans%2C_skinny_jeans_model%2C_merk_Revers_Jeans%2C_maat_S36%2C_objectnr_86974-3%282%29.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fashion_Time%2C_Modeling_Photography_in_Tbilisi_-_Iranian_Model_-_Jorj_Barber_27.jpg/960px-Fashion_Time%2C_Modeling_Photography_in_Tbilisi_-_Iranian_Model_-_Jorj_Barber_27.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Fashion_Time%2C_Modeling_Photography_in_Tbilisi_-_Iranian_Model_-_Jorj_Barber_20.jpg/960px-Fashion_Time%2C_Modeling_Photography_in_Tbilisi_-_Iranian_Model_-_Jorj_Barber_20.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mahsa_Ghazanfari%2C_Iranian_model_and_fashion_designer_%285%29.jpg/960px-Mahsa_Ghazanfari%2C_Iranian_model_and_fashion_designer_%285%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/67/Man_in_distressed_jeans%2C_grey_jacket_and_T-shirt_with_skull_design.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e9/Man_wearing_green_shirt-jacket%2C_blue_jeans_and_desert_boots_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7a/Suit.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Young_Male_in_Suit_holding_a_Camera.jpg/960px-Young_Male_in_Suit_holding_a_Camera.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Harajuku_Fashion_Street_Snap_%282017-09-16_15.12.57_by_Dick_Thomas_Johnson%29.jpg/960px-Harajuku_Fashion_Street_Snap_%282017-09-16_15.12.57_by_Dick_Thomas_Johnson%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Harajuku_Fashion_Street_Snap_%282018-01-08_19.59.25_by_Dick_Thomas_Johnson%29.jpg/960px-Harajuku_Fashion_Street_Snap_%282018-01-08_19.59.25_by_Dick_Thomas_Johnson%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Model_at_the_Spring_Fling_Fashion_Show_%28IMG_4785a%29_%285647149531%29.jpg/960px-Model_at_the_Spring_Fling_Fashion_Show_%28IMG_4785a%29_%285647149531%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Woman_with_bicycle.jpg/960px-Woman_with_bicycle.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8b/Blond_woman_in_rail_tracks_03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e9/Young_woman_outdoors_in_marini%C3%A8re_and_leather_jacket.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Denim_Jeans_Pant_Display.JPG/960px-Denim_Jeans_Pant_Display.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/6/65/Jung_Eun-ji_at_the_High1_Balcony_Concert%2C_22_August_2020_03_%28cropped%3B_blue_skinny_jeans%29.jpg",
]

function img(index: number) {
  return WIKI_CDN[index]
}

export const products: Product[] = [
  {
    id: "1",
    title: "شلوار بگ نخی",
    href: "/products/bag-nakhi",
    image: img(0),
    price: 899000,
    compareAt: 1190000,
    tone: C.cream,
    colors: [C.cream, C.white, C.black, C.olive],
    sizes: women,
    category: "bag",
    inStock: true,
  },
  {
    id: "2",
    title: "شلوار جین کاغذی کمری",
    href: "/products/jean-kaghaz",
    image: img(1),
    price: 1698000,
    compareAt: 1990000,
    tone: C.lightDenim,
    colors: [C.lightDenim, C.denim, C.black],
    sizes: jeans,
    category: "bag",
    inStock: true,
  },
  {
    id: "3",
    title: "شلوار جین نیم‌بگ",
    href: "/products/jean-nim-bag",
    image: img(2),
    price: 2190000,
    compareAt: 2999000,
    tone: C.denim,
    colors: [C.denim, C.charcoal, C.black, C.gray],
    sizes: jeans,
    category: "half-bag",
    inStock: true,
  },
  {
    id: "4",
    title: "شلوار راسته پایین‌کات کتان",
    href: "/products/raste-payin-cut",
    image: img(3),
    price: 1398000,
    tone: C.khaki,
    colors: [C.khaki, C.black, C.navy, C.beige],
    sizes: women,
    category: "straight",
    inStock: true,
  },
  {
    id: "5",
    title: "شلوار جین راسته جذب",
    href: "/products/jean-raste-jazb",
    image: img(4),
    price: 2898000,
    compareAt: 3290000,
    tone: C.charcoal,
    colors: [C.charcoal, C.black, C.denim],
    sizes: jeans,
    category: "straight",
    inStock: true,
  },
  {
    id: "6",
    title: "شلوار مام کتان",
    href: "/products/mom-katan",
    image: img(5),
    price: 799000,
    compareAt: 990000,
    tone: C.beige,
    colors: [C.beige, C.cream, C.olive, C.black],
    sizes: women,
    category: "mom",
    inStock: true,
  },
  {
    id: "7",
    title: "شلوار لینن پنبه",
    href: "/products/linen-panbe",
    image: img(6),
    price: 1100000,
    tone: C.white,
    colors: [C.white, C.cream, C.olive, C.black],
    sizes: women,
    category: "linen",
    inStock: true,
  },
  {
    id: "8",
    title: "شلوار کرپ بگ ریزشی",
    href: "/products/crepe-bag",
    image: img(7),
    price: 1900000,
    compareAt: 2250000,
    tone: C.black,
    colors: [C.black, C.navy, C.brown, C.cream],
    sizes: women,
    category: "bag",
    inStock: true,
  },
  {
    id: "9",
    title: "شلوار کتان فول‌بگ",
    href: "/products/katan-full-bag",
    image: img(8),
    price: 1690000,
    tone: C.olive,
    colors: [C.olive, C.khaki, C.black, C.beige],
    sizes: women,
    category: "bag",
    inStock: true,
  },
  {
    id: "10",
    title: "شلوار جین وایدلگ",
    href: "/products/jean-wide-leg",
    image: img(9),
    price: 1498000,
    compareAt: 1790000,
    tone: C.denim,
    colors: [C.denim, C.lightDenim, C.black],
    sizes: jeans,
    category: "wide",
    inStock: true,
  },
  {
    id: "11",
    title: "شلوار کارگو کتان",
    href: "/products/cargo-katan",
    image: img(10),
    price: 2750000,
    compareAt: 3582000,
    tone: C.khaki,
    colors: [C.khaki, C.olive, C.black, C.navy],
    sizes: jeans,
    category: "cargo",
    inStock: true,
  },
  {
    id: "12",
    title: "شلوار جین مام‌استایل",
    href: "/products/jean-mom-style",
    image: img(11),
    price: 1485000,
    compareAt: 1980000,
    tone: C.lightDenim,
    colors: [C.lightDenim, C.denim, C.black, C.gray],
    sizes: jeans,
    category: "mom",
    inStock: true,
  },
  {
    id: "13",
    title: "شلوار اسکینی جین",
    href: "/products/skinny-jean",
    image: img(12),
    price: 1290000,
    tone: C.black,
    colors: [C.black, C.denim, C.charcoal],
    sizes: jeans,
    category: "skinny",
    inStock: true,
  },
  {
    id: "14",
    title: "شلوار بوت‌کات جین",
    href: "/products/bootcut-jean",
    image: img(13),
    price: 1590000,
    tone: C.denim,
    colors: [C.denim, C.black, C.navy],
    sizes: jeans,
    category: "bootcut",
    inStock: true,
  },
  {
    id: "15",
    title: "شلوار گاباردین رسمی رگولار",
    href: "/products/gabardine-regular",
    image: img(14),
    price: 3780000,
    tone: C.charcoal,
    colors: [C.charcoal, C.navy, C.black, C.gray],
    sizes: ["۴۰", "۴۲", "۴۴", "۴۶", "۴۸"],
    category: "formal",
    inStock: true,
  },
  {
    id: "16",
    title: "شلوار پنبه گلکسی",
    href: "/products/panbe-galaxy",
    image: img(15),
    price: 1498000,
    tone: C.mocha,
    colors: [C.mocha, C.cream, C.black, C.olive],
    sizes: women,
    category: "straight",
    inStock: true,
  },
  {
    id: "17",
    title: "شلوار سیلک راسته",
    href: "/products/silk-raste",
    image: img(16),
    price: 1690000,
    tone: C.navy,
    colors: [C.navy, C.black, C.cream, C.brown],
    sizes: women,
    category: "straight",
    inStock: true,
  },
  {
    id: "18",
    title: "شلوار سیلک کمردار",
    href: "/products/silk-kamar",
    image: img(17),
    price: 1798000,
    tone: C.black,
    colors: [C.black, C.navy, C.brown],
    sizes: women,
    category: "formal",
    inStock: true,
  },
  {
    id: "19",
    title: "شلوار شافل مازراتی",
    href: "/products/shuffle-mazarati",
    image: img(18),
    price: 1198000,
    tone: C.gray,
    colors: [C.gray, C.black, C.navy, C.olive],
    sizes: women,
    category: "straight",
    inStock: true,
  },
  {
    id: "20",
    title: "شلوار جین مام کارگو",
    href: "/products/mom-cargo-jean",
    image: img(19),
    price: 2750000,
    compareAt: 5500000,
    tone: C.denim,
    colors: [C.denim, C.black, C.khaki],
    sizes: jeans,
    category: "cargo",
    inStock: true,
  },
  {
    id: "21",
    title: "شلوار لینن بغل‌کش",
    href: "/products/linen-baghal-kesh",
    image: img(20),
    price: 1250000,
    tone: C.beige,
    colors: [C.beige, C.white, C.olive, C.black],
    sizes: women,
    category: "linen",
    inStock: true,
  },
  {
    id: "22",
    title: "شلوار مام‌فیت کتان",
    href: "/products/mom-fit-katan",
    image: img(21),
    price: 998000,
    compareAt: 1599000,
    tone: C.stone,
    colors: [C.stone, C.beige, C.black, C.olive],
    sizes: women,
    category: "mom",
    inStock: true,
  },
  {
    id: "23",
    title: "شلوار نیم‌بگ اوریب",
    href: "/products/nim-bag-orib",
    image: img(22),
    price: 1598000,
    tone: C.cream,
    colors: [C.cream, C.black, C.navy, C.brown],
    sizes: women,
    category: "half-bag",
    inStock: true,
  },
  {
    id: "24",
    title: "شلوار پارچه‌ای راسته",
    href: "/products/parche-raste",
    image: img(23),
    price: 1290000,
    tone: C.black,
    colors: [C.black, C.navy, C.gray, C.cream],
    sizes: women,
    category: "straight",
    inStock: false,
  },
];

export const PRICE_MAX = 6000000;
export type CategoryLabelKey = keyof typeof messages.categories;
export type CatalogCategory = {
  id: string
  labelKey: CategoryLabelKey;
  icon: string
  href: string
}

export type CatalogColorFilter = {
  id: string
  label: string
  value: string
}

export type CatalogFilters = {
  categories: CatalogCategory[]
  colors: CatalogColorFilter[]
  sizes: string[]
  priceMax: number
}

export const defaultFilters: CatalogFilters = {
  categories: categories.map((category) => ({
    ...category,
    labelKey: category.label as CategoryLabelKey,
  }) as CatalogCategory),
  colors: colorFilters,
  sizes: sizeFilters,
  priceMax: PRICE_MAX,
}

const CATEGORY_ALIASES: Record<string, string> = {
  bag: "bag",
  shirts: "bag",
  بگ: "bag",
  "half-bag": "half-bag",
  "نیم‌بگ": "half-bag",
  "نیم-بگ": "half-bag",
  mom: "mom",
  sweatshirts: "mom",
  "مام‌استایل": "mom",
  "مام-استایل": "mom",
  straight: "straight",
  merch: "straight",
  راسته: "straight",
  wide: "wide",
  وایدلگ: "wide",
  cargo: "cargo",
  pants: "cargo",
  کارگو: "cargo",
  skinny: "skinny",
  اسکینی: "skinny",
  bootcut: "bootcut",
  "بوت‌کات": "bootcut",
  linen: "linen",
  لینن: "linen",
  formal: "formal",
  رسمی: "formal",
}

const CATEGORY_ICONS: Record<string, string> = {
  bag: "fa-bag-shopping",
  "half-bag": "fa-shirt",
  mom: "fa-child",
  straight: "fa-grip-lines",
  wide: "fa-arrows-left-right",
  cargo: "fa-box",
  skinny: "fa-person",
  bootcut: "fa-shoe-prints",
  linen: "fa-leaf",
  formal: "fa-user-tie",
}

export function categoryKey(value: string) {
  return CATEGORY_ALIASES[value] || CATEGORY_ALIASES[value.toLowerCase()] || value
}

export function categoryIcon(id: string, label = "") {
  const key = categoryKey(id)
  return (
    CATEGORY_ICONS[key] ||
    CATEGORY_ICONS[id] ||
    CATEGORY_ICONS[label] ||
    "fa-shirt"
  )
}

export function categoriesMatch(left: string, right: string) {
  if (!left || !right) {
    return false
  }
  return left === right || categoryKey(left) === categoryKey(right)
}

export function formatToman(value: number): string {
  return `${value.toLocaleString("fa-IR")} ریال`;
}

export function discountPercent(product: Product): number | null {
  if (!product.compareAt || product.compareAt <= product.price) {
    return null;
  }

  return Math.round((1 - product.price / product.compareAt) * 100);
}

export function colorLabel(value: string): string {
  return colorFilters.find((item) => item.value === value)?.label ?? value;
}

export function categoryLabel(id: string, list: CatalogCategory[] = categories.map((category) => ({
  ...category,
  labelKey: category.label as CategoryLabelKey,
}) as CatalogCategory)): string {
  return (
    list.find((item) => item.id === id || categoriesMatch(item.id, id))?.labelKey ??
    id
  )
}

export function colorLabelFrom(
  value: string,
  list: CatalogColorFilter[] = colorFilters,
): string {
  return list.find((item) => item.value === value)?.label ?? colorLabel(value)
}

export function similarProducts(
  product: Product,
  limit = 4,
  catalog: Product[] = products,
): Product[] {
  const same = catalog.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const rest = catalog.filter(
    (item) => item.id !== product.id && item.category !== product.category,
  );

  return [...same, ...rest].slice(0, limit);
}

export function fabricLabel(product: Product): string {
  if (product.title.includes("جین")) {
    return "جین";
  }
  if (product.title.includes("لینن")) {
    return "لینن";
  }
  if (product.title.includes("کتان")) {
    return "کتان";
  }
  if (product.title.includes("کرپ")) {
    return "کرپ";
  }
  if (product.title.includes("سیلک")) {
    return "سیلک";
  }
  if (product.title.includes("گاباردین")) {
    return "گاباردین";
  }

  return "نخی";
}

const LIGHT_COLORS = new Set([
  C.white,
  C.cream,
  C.beige,
  C.khaki,
  C.stone,
  C.lightDenim,
]);

export function isLightColor(value: string): boolean {
  return LIGHT_COLORS.has(value);
}

export function productSku(product: Product): string {
  return `P${(41000 + Number(product.id)).toString()}`;
}

export function productImages(product: Product): string[] {
  const index = Number(product.id) - 1;
  const count = WIKI_CDN.length;

  return [
    WIKI_CDN[index % count],
    WIKI_CDN[(index + 8) % count],
    WIKI_CDN[(index + 16) % count],
  ];
}

export function productLength(product: Product): string {
  const cm = 100 + (Number(product.id) % 9);
  return `${cm.toLocaleString("fa-IR")} سانتی‌متر`;
}

export type SizeChartRow = {
  size: string;
  waist: string;
  hip: string;
  length: string;
};

export type SizeFitVote = {
  id: "muchLarger" | "bitLarger" | "expected" | "bitSmaller" | "muchSmaller";
  count: number;
};

const womenChart: SizeChartRow[] = [
  { size: "۳۶", waist: "۶۶–۷۰", hip: "۹۰–۹۴", length: "۹۸" },
  { size: "۳۸", waist: "۷۰–۷۴", hip: "۹۴–۹۸", length: "۱۰۰" },
  { size: "۴۰", waist: "۷۴–۷۸", hip: "۹۸–۱۰۲", length: "۱۰۲" },
  { size: "۴۲", waist: "۷۸–۸۲", hip: "۱۰۲–۱۰۶", length: "۱۰۲" },
  { size: "۴۴", waist: "۸۲–۸۶", hip: "۱۰۶–۱۱۰", length: "۱۰۳" },
];

const jeansChart: SizeChartRow[] = [
  { size: "۲۹", waist: "۷۴", hip: "۹۴", length: "۱۰۰" },
  { size: "۳۰", waist: "۷۶", hip: "۹۶", length: "۱۰۰" },
  { size: "۳۱", waist: "۷۸", hip: "۹۸", length: "۱۰۲" },
  { size: "۳۲", waist: "۸۰", hip: "۱۰۰", length: "۱۰۲" },
  { size: "۳۳", waist: "۸۲", hip: "۱۰۲", length: "۱۰۳" },
  { size: "۳۴", waist: "۸۴", hip: "۱۰۴", length: "۱۰۳" },
];

export function sizeChart(product: Product): SizeChartRow[] {
  const source = product.sizes.includes("۲۹") ? jeansChart : womenChart;
  const rows = source.filter((row) => product.sizes.includes(row.size));
  return rows.length ? rows : source;
}

export function sizeFitVotes(product: Product): SizeFitVote[] {
  const n = Number(product.id) || 1;

  return [
    { id: "muchLarger", count: 6 + (n % 5) },
    { id: "bitLarger", count: 8 + (n % 7) },
    { id: "expected", count: 28 + (n % 12) },
    { id: "bitSmaller", count: 3 + (n % 4) },
    { id: "muchSmaller", count: 1 + (n % 2) },
  ];
}
