import { CATEGORIES } from "@/lib/data";
import { getProducts } from "@/lib/store";
import ProductsAdmin from "@/components/admin/ProductsAdmin";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsAdmin products={products} categories={CATEGORIES.map((c) => ({ id: c.id, name: c.name }))} />;
}
