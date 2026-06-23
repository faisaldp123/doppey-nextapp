import { requireLogin } from "@/utils/auth";
import { getProductId } from "@/utils/productHelpers";

const readList = (key) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const writeList = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event(`${key}Updated`));
};

export const showShopToast = (type, message) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("shop-toast", { detail: { type, message } })
  );
};

export const getCart = () => readList("cart");
export const getWishlist = () => readList("wishlist");

export const addToCart = (product, quantity = 1, extra = {}) => {
  if (!requireLogin()) return { ok: false, cart: getCart() };

  const cart = getCart();
  const productId = getProductId(product);
  const exists = cart.find((item) => getProductId(item) === productId);

  if (exists) {
    showShopToast("cart", "Product already added to cart");
    return { ok: false, cart };
  }

  const updated = [...cart, { ...product, ...extra, quantity }];
  writeList("cart", updated);
  showShopToast("cart", `${product.name} added to cart`);
  return { ok: true, cart: updated };
};

export const removeFromCart = (product) => {
  const cart = getCart();
  const productId = typeof product === "string" ? product : getProductId(product);
  const item = cart.find((entry) => getProductId(entry) === productId);
  const updated = cart.filter((entry) => getProductId(entry) !== productId);

  writeList("cart", updated);
  showShopToast("remove", `${item?.name || "Product"} removed from cart`);
  return updated;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const updated = cart.map((item) =>
    getProductId(item) === productId ? { ...item, quantity } : item
  );
  writeList("cart", updated);
  return updated;
};

export const toggleWishlist = (product) => {
  if (!requireLogin()) return { inWishlist: false, wishlist: getWishlist() };

  const wishlist = getWishlist();
  const productId = getProductId(product);
  const exists = wishlist.some((item) => getProductId(item) === productId);
  const updated = exists
    ? wishlist.filter((item) => getProductId(item) !== productId)
    : [...wishlist, product];

  writeList("wishlist", updated);
  showShopToast(
    exists ? "remove" : "wishlist",
    `${product.name} ${exists ? "removed from wishlist" : "added to wishlist"}`
  );

  return { inWishlist: !exists, wishlist: updated };
};
