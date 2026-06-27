"use client";

import { useRouter } from "next/router";
import ProductListingPage from "../../components/ProductListingPage";

const titleCase = (value = "") =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function CategoryPage() {
  const router = useRouter();
  const { main } = router.query;

  if (!main) return null;

  return (
    <ProductListingPage
      mainCategory={String(main)}
      title={titleCase(String(main))}
    />
  );
}