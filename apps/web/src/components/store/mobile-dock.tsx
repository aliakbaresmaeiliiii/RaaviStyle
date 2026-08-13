import { MobileDockNav } from "@/components/store/mobile-dock-nav";
import { getCustomer } from "@/lib/auth";

export async function MobileDock() {
  const customer = await getCustomer();

  return (
    <MobileDockNav
      accountHref={customer ? "/account" : "/login"}
      signedIn={Boolean(customer)}
    />
  );
}
