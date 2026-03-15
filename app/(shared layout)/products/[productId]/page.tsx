import { getProductById } from "@/app/actions";
import { SingleProductComp } from "@/components/web/single-product";
import { redirect } from "next/navigation";

interface Props {
  productId: string;
}

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
