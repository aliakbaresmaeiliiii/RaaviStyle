export type Product = {
  id: string;
  title: string;
  href: string;
  price: number;
  compareAt?: number;
  badge?: string;
  tone: string;
  sold?: string;
};

export const categories = [
  { href: "/products?cat=women", label: "زنانه", icon: "fa-person-dress" },
  { href: "/products?cat=men", label: "مردانه", icon: "fa-person" },
  { href: "/products?cat=kids", label: "بچگانه", icon: "fa-child" },
  { href: "/products?cat=shoes", label: "کفش", icon: "fa-shoe-prints" },
  { href: "/products?cat=bags", label: "کیف", icon: "fa-bag-shopping" },
  { href: "/products?cat=sport", label: "ورزشی", icon: "fa-dumbbell" },
  { href: "/products?cat=accessories", label: "اکسسوری", icon: "fa-gem" },
  { href: "/products?cat=sale", label: "حراج", icon: "fa-tags" },
];

export const products: Product[] = [
  {
    id: "1",
    title: "مانتو لینن تابستانی",
    href: "/products/manto-linen",
    price: 1890000,
    compareAt: 2490000,
    badge: "۲۴٪",
    tone: "#c4a39a",
    sold: "۱۲۰ فروش در هفته",
  },
  {
    id: "2",
    title: "شلوار پارچه‌ای راسته",
    href: "/products/pants-wide",
    price: 1290000,
    tone: "#7e8774",
    sold: "تنها ۳ عدد مانده",
  },
  {
    id: "3",
    title: "کفش چرم روزمره",
    href: "/products/leather-shoe",
    price: 2190000,
    compareAt: 2590000,
    badge: "۱۵٪",
    tone: "#5c3d32",
  },
  {
    id: "4",
    title: "کیف دوشی مینیمال",
    href: "/products/mini-bag",
    price: 980000,
    tone: "#a47864",
  },
  {
    id: "5",
    title: "پیراهن نخی یقه هفت",
    href: "/products/cotton-shirt",
    price: 790000,
    compareAt: 1100000,
    badge: "۲۸٪",
    tone: "#e4d5c3",
    sold: "۸۴ فروش در هفته",
  },
  {
    id: "6",
    title: "هودی گرم زمستانی",
    href: "/products/hoodie",
    price: 1450000,
    tone: "#1a1412",
  },
  {
    id: "7",
    title: "دامن پلیسه میدی",
    href: "/products/pleated-skirt",
    price: 1120000,
    tone: "#c9a36a",
  },
  {
    id: "8",
    title: "کت تک دکمه",
    href: "/products/blazer",
    price: 2890000,
    compareAt: 3400000,
    badge: "۱۵٪",
    tone: "#3a2a24",
  },
];

export const amazingOffers = products.filter((item) => item.compareAt);

export function formatToman(value: number): string {
  return `${value.toLocaleString("fa-IR")} تومان`;
}
