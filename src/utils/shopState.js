import { getProductId } from "@/utils/productHelpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let productsCache = null;

const readList = (key) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const writeList = (key, value) => {
  if (typeof window === "undefined") return;
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

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const authHeaders = () => {
  const token = getAuthToken();
  if (!token) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const request = async (endpoint, options = {}) => {
  const headers = authHeaders();
  if (!headers || !API_URL) return null;

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  if (response.status === 204) return { success: true };
  return response.json().catch(() => null);
};

const normalizeProductList = (data) => {
  const list = Array.isArray(data)
    ? data
    : data?.items || data?.cart || data?.wishlist || data?.products || [];

  return list
    .map((item) => {
      if (typeof item === "string") return { _id: item };
      const product = item.product || item.productId || item;
      if (!product || typeof product !== "object") return null;

      return {
        ...product,
        quantity: item.quantity || product.quantity || 1,
        size: item.size || product.size,
      };
    })
    .filter(Boolean);
};

const mergeProductLists = (...lists) => {
  const byId = new Map();

  lists.flat().forEach((item) => {
    const productId = getProductId(item);
    if (!productId) return;
    const existing = byId.get(productId) || {};
    byId.set(productId, {
      ...existing,
      ...item,
      quantity: item.quantity || existing.quantity || 1,
    });
  });

  return [...byId.values()];
};

const loadPublicProducts = async () => {
  if (productsCache) return productsCache;

  const data = await request("/products/public");
  productsCache = normalizeProductList(data);
  return productsCache;
};

const hydrateProductRefs = async (items) => {
  const needsHydration = items.some((item) => {
    const keys = Object.keys(item || {});
    return keys.length === 1 && keys[0] === "_id";
  });

  if (!needsHydration) return items;

  const products = await loadPublicProducts();
  if (!products.length) return items;

  return items.map((item) => {
    const product = products.find((entry) => getProductId(entry) === getProductId(item));
    return product ? { ...product, ...item } : item;
  });
};

const syncCartToBackend = async (action, productId, quantity = 1, extra = {}) => {
  if (!getAuthToken()) return;

  try {
    const endpoint = {
      add: "/cart/add",
      remove: "/cart/remove",
      update: "/cart/update",
      clear: "/cart/clear",
    }[action];

    await request(endpoint, {
      method: "POST",
      body: JSON.stringify({ productId, quantity, ...extra }),
    });
  } catch (err) {
    console.error("Cart sync failed:", err);
  }
};

const syncWishlistToBackend = async (action, productId) => {
  if (!getAuthToken()) return;

  const endpoints =
    action === "add"
      ? ["/wishlist/add", "/wishlist", "/wishlist/toggle"]
      : ["/wishlist/remove", "/wishlist", "/wishlist/toggle"];

  for (const endpoint of endpoints) {
    const result = await request(endpoint, {
      method: "POST",
      body: JSON.stringify({ productId }),
    });

    if (result !== null) return;
  }
};

export const syncLocalShopStateToBackend = async () => {
  if (!getAuthToken()) return;

  const cart = readList("cart");
  const wishlist = readList("wishlist");

  await Promise.allSettled([
    ...cart.map((item) =>
      syncCartToBackend("add", getProductId(item), item.quantity || 1, {
        size: item.size,
      })
    ),
    ...wishlist.map((item) => syncWishlistToBackend("add", getProductId(item))),
  ]);
};

export const loadUserDataFromBackend = async () => {
  if (!getAuthToken()) {
    return { cart: readList("cart"), wishlist: readList("wishlist") };
  }

  try {
    const localCart = readList("cart");
    const localWishlist = readList("wishlist");
    const cartItems = mergeProductLists(
      localCart,
      normalizeProductList(await request("/cart"))
    );
    writeList("cart", cartItems);

    let wishlistItems = [];
    wishlistItems = normalizeProductList(await request("/wishlist"));

    if (!wishlistItems.length) {
      const profile = await request("/profile");
      wishlistItems = normalizeProductList(profile?.wishlist || []);
    }

    const mergedWishlist = await hydrateProductRefs(
      mergeProductLists(localWishlist, wishlistItems)
    );

    writeList("wishlist", mergedWishlist);

    await Promise.allSettled(
      mergedWishlist.map((item) => syncWishlistToBackend("add", getProductId(item)))
    );

    return { cart: cartItems, wishlist: mergedWishlist };
  } catch (err) {
    return { cart: readList("cart"), wishlist: readList("wishlist") };
  }
};

export const clearUserData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cart");
  localStorage.removeItem("wishlist");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const getCart = () => readList("cart");
export const getWishlist = () => readList("wishlist");

export const addToCart = (product, quantity = 1, extra = {}) => {
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
  syncCartToBackend("add", productId, quantity, extra);
  return { ok: true, cart: updated };
};

export const removeFromCart = (product) => {
  const cart = getCart();
  const productId = typeof product === "string" ? product : getProductId(product);
  const item = cart.find((entry) => getProductId(entry) === productId);
  const updated = cart.filter((entry) => getProductId(entry) !== productId);

  writeList("cart", updated);
  showShopToast("remove", `${item?.name || "Product"} removed from cart`);
  syncCartToBackend("remove", productId);
  return updated;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const updated = cart.map((item) =>
    getProductId(item) === productId ? { ...item, quantity } : item
  );

  writeList("cart", updated);
  syncCartToBackend("update", productId, quantity);
  return updated;
};

export const clearCart = () => {
  writeList("cart", []);
  syncCartToBackend("clear");
};

export const toggleWishlist = (product) => {
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
  syncWishlistToBackend(exists ? "remove" : "add", productId);
  return { inWishlist: !exists, wishlist: updated };
};
