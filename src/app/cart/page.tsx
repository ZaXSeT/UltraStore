"use client";

import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

// ponytail: /cart redirects to /shop and opens the drawer.
// Remove this page once all deep links to /cart are cleaned up.
export default function CartPage() {
  const { openCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    openCart();
    router.replace("/shop");
  }, [openCart, router]);

  return null;
}
