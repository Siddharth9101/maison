import { getProductById } from "@/app/actions";
import { SingleProductComp } from "@/components/web/single-product";
import { Metadata } from "next";
import { redirect } from "next/navigation";
interface Props {
  productId: string;
}

export const generateMetadata = async ({
  params,
}: {
  params: Props;
}): Promise<Metadata> => {
  const { productId } = await params;

  const product = await getProductById(productId);
  if (!product || !product.success) {
    return {
      title: "No Product Found | Maison",
      description: "No product found with the given ID.",
    };
  }
  return {
    title: `${product.data.name} | Maison`,
    description: product.data.description,
  };
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const { productId } = await params;
  const response = await getProductById(productId);

  if (!response || !response.success) {
    redirect("/");
  }
  const product = response.data;

  //   product found
  return (
    <div className="container py-8">
      <SingleProductComp key={product.id} product={product} />
    </div>
  );
}
