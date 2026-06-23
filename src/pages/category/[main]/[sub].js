"use client";

import { useRouter } from "next/router";
import ProductListingPage from "../../../components/ProductListingPage";

const titleCase = (value = "") =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function CategorySubPage() {
  const router = useRouter();
  const { main, sub } = router.query;

  if (!main || !sub) {
    return null;
  }

  return (
    <ProductListingPage
      mainCategory={String(main)}
      subCategory={String(sub)}
      title={`${titleCase(String(main))} - ${titleCase(String(sub))}`}
    />
  );
}
