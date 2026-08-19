import { messages } from "./i18n/fa";

export type Product = {
  id: string;
  title: string;
  href: string;
  image: string[];
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
  {
    id: "bag",
    label: "بگ",
    icon: "fa-bag-shopping",
    href: "/products?cat=bag",
  },
  {
    id: "half-bag",
    label: "نیم‌بگ",
    icon: "fa-shirt",
    href: "/products?cat=half-bag",
  },
  {
    id: "mom",
    label: "مام‌استایل",
    icon: "fa-child",
    href: "/products?cat=mom",
  },
  {
    id: "straight",
    label: "راسته",
    icon: "fa-grip-lines",
    href: "/products?cat=straight",
  },
  {
    id: "wide",
    label: "وایدلگ",
    icon: "fa-arrows-left-right",
    href: "/products?cat=wide",
  },
  { id: "cargo", label: "کارگو", icon: "fa-box", href: "/products?cat=cargo" },
  {
    id: "skinny",
    label: "اسکینی",
    icon: "fa-person",
    href: "/products?cat=skinny",
  },
  {
    id: "bootcut",
    label: "بوت‌کات",
    icon: "fa-shoe-prints",
    href: "/products?cat=bootcut",
  },
  { id: "linen", label: "لینن", icon: "fa-leaf", href: "/products?cat=linen" },
  {
    id: "formal",
    label: "رسمی",
    icon: "fa-user-tie",
    href: "/products?cat=formal",
  },
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

export const sizeFilters = [
  "۳۶",
  "۳۸",
  "۴۰",
  "۴۲",
  "۴۴",
  "۴۶",
  "۴۸",
  "۲۹",
  "۳۰",
  "۳۱",
  "۳۲",
  "۳۳",
  "۳۴",
];

const women = ["۳۶", "۳۸", "۴۰", "۴۲", "۴۴"];
const jeans = ["۲۹", "۳۰", "۳۱", "۳۲", "۳۳", "۳۴"];

const PANTS_IMAGES = [
  "/Pants/pant1.jpg",
];

function img(index: number) {
  debugger;
  return PANTS_IMAGES[index];
}

export const products: Product[] = [
  {
    id: "1",
    title: "شلوا",
    href: "../../public/products/logo-dark.png",
    image: [img(0)],
    price: 200000,
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
    href: "./public/products/logo-dark.png",
    image: [img(1)],
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
    href: "./public/products/logo-dark.png",
    image: [img(2)],
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
    href: "./public/products/logo-dark.png",
    image: [img(3)],
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
    href: "./public/products/logo-dark.png",

    image: [img(4)],
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
    href: "./public/products/logo-dark.png",

    image: [img(5)],
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
    image: [img(6)],
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
    image: [img(7)],
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
    image: [img(8)],
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
    image: [img(9)],
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
    image: [img(10)],
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
    image: [img(11)],
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
    image: [img(12)],
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
    image: [img(13)],
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
    image: [img(14)],
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
    image: [img(15)],
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
    image: [img(16)],
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
    image: [img(17)],
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
    image: [img(18)],
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
    image: [img(19)],
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
    image: [img(20)],
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
    image: [img(21)],
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
    image: [img(22)],
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
    image: [img(23)],
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
  id: string;
  labelKey: CategoryLabelKey;
  icon: string;
  href: string;
};

export type CatalogColorFilter = {
  id: string;
  label: string;
  value: string;
};

export type CatalogFilters = {
  categories: CatalogCategory[];
  colors: CatalogColorFilter[];
  sizes: string[];
  priceMax: number;
};

export const defaultFilters: CatalogFilters = {
  categories: categories.map(
    (category) =>
      ({
        ...category,
        labelKey: category.label as CategoryLabelKey,
      }) as CatalogCategory,
  ),
  colors: colorFilters,
  sizes: sizeFilters,
  priceMax: PRICE_MAX,
};

const CATEGORY_ALIASES: Record<string, string> = {
  bag: "bag",
  shirts: "bag",
  بگ: "bag",
  "half-bag": "half-bag",
  نیم‌بگ: "half-bag",
  "نیم-بگ": "half-bag",
  mom: "mom",
  sweatshirts: "mom",
  مام‌استایل: "mom",
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
  بوت‌کات: "bootcut",
  linen: "linen",
  لینن: "linen",
  formal: "formal",
  رسمی: "formal",
};

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
};

export function categoryKey(value: string) {
  return (
    CATEGORY_ALIASES[value] || CATEGORY_ALIASES[value.toLowerCase()] || value
  );
}

export function categoryIcon(id: string, label = "") {
  const key = categoryKey(id);
  return (
    CATEGORY_ICONS[key] ||
    CATEGORY_ICONS[id] ||
    CATEGORY_ICONS[label] ||
    "fa-shirt"
  );
}

export function categoriesMatch(left: string, right: string) {
  if (!left || !right) {
    return false;
  }
  return left === right || categoryKey(left) === categoryKey(right);
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

export function categoryLabel(
  id: string,
  list: CatalogCategory[] = categories.map(
    (category) =>
      ({
        ...category,
        labelKey: category.label as CategoryLabelKey,
      }) as CatalogCategory,
  ),
): string {
  return (
    list.find((item) => item.id === id || categoriesMatch(item.id, id))
      ?.labelKey ?? id
  );
}

export function colorLabelFrom(
  value: string,
  list: CatalogColorFilter[] = colorFilters,
): string {
  return list.find((item) => item.value === value)?.label ?? colorLabel(value);
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
  const count = PANTS_IMAGES.length;

  return [
    PANTS_IMAGES[index % count],
    PANTS_IMAGES[(index + 8) % count],
    PANTS_IMAGES[(index + 16) % count],
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
