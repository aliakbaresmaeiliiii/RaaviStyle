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
  { id: "bag", label: "بگ", icon: "fa-tag", href: "/?cat=bag" },
  { id: "half-bag", label: "نیم‌بگ", icon: "fa-tag", href: "/?cat=half-bag" },
  { id: "mom", label: "مام‌استایل", icon: "fa-tag", href: "/?cat=mom" },
  { id: "straight", label: "راسته", icon: "fa-tag", href: "/?cat=straight" },
  { id: "wide", label: "وایدلگ", icon: "fa-tag", href: "/?cat=wide" },
  { id: "cargo", label: "کارگو", icon: "fa-tag", href: "/?cat=cargo" },
  { id: "skinny", label: "اسکینی", icon: "fa-tag", href: "/?cat=skinny" },
  { id: "bootcut", label: "بوت‌کات", icon: "fa-tag", href: "/?cat=bootcut" },
  { id: "linen", label: "لینن", icon: "fa-tag", href: "/?cat=linen" },
  { id: "formal", label: "رسمی", icon: "fa-tag", href: "/?cat=formal" },
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

function img(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=1200&q=80`;
}

export const products: Product[] = [
  {
    id: "1",
    title: "شلوار بگ نخی",
    href: "/products/bag-nakhi",
    image: img("photo-1594633313593-bab3825d0caf"),
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
    image: img("photo-1542272604-787c3835535d"),
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
    image: img("photo-1541099649105-f69ad21f3246"),
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
    image: img("photo-1473966968600-fa801b869a1a"),
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
    image: img("photo-1552902865-b72c031ac5ea"),
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
    image: img("photo-1506629082955-511b1aa153c3"),
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
    image: img("photo-1582418702052-110b22d8046f"),
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
    image: img("photo-1624378439575-d8705ad7ae80"),
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
    image: img("photo-1558171813-4c088a55b225"),
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
    image: img("photo-1584370848010-d7fe6bc767ec"),
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
    image: img("photo-1602293589930-45aad59ba3ab"),
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
    image: img("photo-1582552938357-32b906df40cb"),
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
    image: img("photo-1604176354204-9268737828e4"),
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
    image: img("photo-1565084888279-aca607ecce0c"),
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
    image: img("photo-1617127365659-c47fa864d8bc"),
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
    image: img("photo-1591195853828-11db59a44d6b"),
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
    image: img("photo-1475180098084-4fcdfe2c8615"),
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
    image: img("photo-1507680434567-5733c3ca9947"),
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
    image: img("photo-1548883354-7622d03aca29"),
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
    image: img("photo-1576995853123-5a10305d93c0"),
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
    image: img("photo-1525507119028-ed4c629a60a3"),
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
    image: img("photo-1551854838-c0a3d2769ca3"),
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
    image: img("photo-1483985988355-763728e1935b"),
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
    image: img("photo-1445205170230-053b83016050"),
    price: 1290000,
    tone: C.black,
    colors: [C.black, C.navy, C.gray, C.cream],
    sizes: women,
    category: "straight",
    inStock: false,
  },
];

export const PRICE_MAX = 6000000;

export function formatToman(value: number): string {
  return `${value.toLocaleString("fa-IR")} تومان`;
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

export function categoryLabel(id: string): string {
  return categories.find((item) => item.id === id)?.label ?? id;
}

export function similarProducts(product: Product, limit = 4): Product[] {
  const same = products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const rest = products.filter(
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
  const [base] = product.image.split("?");
  return [
    `${base}?auto=format&fit=crop&w=900&h=1200&q=80`,
    `${base}?auto=format&fit=crop&crop=top&w=900&h=1200&q=80`,
    `${base}?auto=format&fit=crop&crop=entropy&w=900&h=1200&q=80`,
  ];
}

export function productLength(product: Product): string {
  const cm = 100 + (Number(product.id) % 9);
  return `${cm.toLocaleString("fa-IR")} سانتی‌متر`;
}
