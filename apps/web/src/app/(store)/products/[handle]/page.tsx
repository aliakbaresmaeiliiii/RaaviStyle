import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/product-detail";
import { getCustomer } from "@/lib/auth";
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

  const customer = await getCustomer();
  const reviewerName = [customer?.first_name, customer?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <ProductDetail
      product={product}
      similar={similarProducts(product)}
      reviewerName={reviewerName}
    />
  );
}
