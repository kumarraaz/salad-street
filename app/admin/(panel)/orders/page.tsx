import { readStore } from "@/lib/store";
import OrdersAdmin from "@/components/admin/OrdersAdmin";

export const metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [{ orders }, sp] = await Promise.all([readStore(), searchParams]);
  return <OrdersAdmin orders={orders} initial={sp.status || "all"} />;
}
