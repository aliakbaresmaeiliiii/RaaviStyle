import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/product-detail";
import { getCustomer } from "@/lib/auth";
import { similarProducts } from "@/lib/catalog";
import { messages } from "@/lib/i18n";
import { loadStoreProducts } from "@/lib/medusa-catalog";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const catalog = await loadStoreProducts();
  const product = catalog.find((item) => item.href.endsWith(`/${handle}`));

  return {
    title: product
      ? `${product.title} | ${messages.brand}`
      : messages.meta.title,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const catalog = await loadStoreProducts();
  const product = catalog.find((item) => item.href.endsWith(`/${handle}`));

  if (!product) {
    notFound();
  }

  const customer = await getCustomer();
  const reviewerName = [customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <ProductDetail
      product={product}
      similar={similarProducts(product, 4, catalog)}
      reviewerName={reviewerName}
    />
  );
}
