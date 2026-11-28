import { getComingSoon } from "@/lib/store";
import SoonAdmin from "@/components/admin/SoonAdmin";

export const metadata = { title: "Coming Soon" };

export default async function ComingSoonPage() {
  return <SoonAdmin items={await getComingSoon()} />;
}
