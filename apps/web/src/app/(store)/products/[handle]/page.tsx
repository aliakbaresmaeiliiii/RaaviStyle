import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/product-detail";
import { products, similarProducts } from "@/lib/catalog";
import { messages } from "@/lib/i18n";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

function findProduct(handle: string) {
  return products.find((item) => item.href.endsWith(`/${handle}`));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = findProduct(handle);

  return {
    title: product
      ? `${product.title} | ${messages.brand}`
      : messages.meta.title,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = findProduct(handle);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} similar={similarProducts(product)} />;
}
