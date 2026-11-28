import { readStore } from "@/lib/store";
import NotifyAdmin from "@/components/admin/NotifyAdmin";

export const metadata = { title: "Notify requests" };

export default async function NotifyPage() {
  const { notify } = await readStore();
  return <NotifyAdmin list={notify} />;
}
