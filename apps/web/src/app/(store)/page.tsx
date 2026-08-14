import { StoreHome } from "@/components/store/store-home";
import { loadStoreProducts } from "@/lib/medusa-catalog";
import { loadSitePage } from "@/lib/medusa-cms";

export default async function Home() {
  const [products, cms] = await Promise.all([
    loadStoreProducts(),
    loadSitePage("home"),
  ]);

  return <StoreHome products={products} cms={cms} />;
}
