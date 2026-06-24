

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/collection/ProductCard";

import API from "@/utils/api";
import {
  getCategorySlug,
  getImageUrl,
  getProductId,
  getProductImages,
  getProductSlug,
  getStoredReviews,
  saveStoredReviews,
} from "@/utils/productHelpers";
import {
  addToCart as addProductToCart,
  removeFromCart as removeProductFromCart,
  toggleWishlist as toggleProductWishlist,
} from "@/utils/shopState";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import {
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "../../styles/ProductDetail.module.css";

export default function ProductDetail() {
  const router = useRouter();
  const { id: slug } = router.query;

  const [allProducts, setAllProducts] = useState([]);

  const [product, setProduct] = useState(null);

  const [mainImg, setMainImg] = useState("");

  const [qty, setQty] = useState(1);

  const [selectedSize, setSelectedSize] = useState("");

  const [wishlist, setWishlist] = useState([]);

  const [activeTab, setActiveTab] = useState("description");

  const [isInCart, setIsInCart] = useState(false);

  const [toast, setToast] = useState({
  show: false,
  type: "",
  message: "",
});

  const [pincode, setPincode] = useState("");

  const [deliveryMsg, setDeliveryMsg] = useState("");

  const [reviews, setReviews] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const showToast = (type, message) => {
  setToast({
    show: true,
    type,
    message,
  });

  setTimeout(() => {
    setToast({
      show: false,
      type: "",
      message: "",
    });
  }, 3000);
};

  useEffect(() => {
  const fetchProduct = async () => {
    if (!slug) return;

    try {
      const res = await API.get(
        `/products/product/${slug}`
      );

      const foundProduct = res.data;

      const allProductsRes = await API.get(
  "/products/public"
);

setAllProducts(allProductsRes.data);

      setProduct(foundProduct);

      setMainImg(
        getProductImages(foundProduct)[0] || ""
      );

      const cart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const alreadyAdded = cart.some(
        (item) =>
          getProductId(item) === getProductId(foundProduct)
      );

      setIsInCart(alreadyAdded);

      const viewed =
        JSON.parse(
          localStorage.getItem(
            "recentlyViewed"
          )
        ) || [];

      const filtered = viewed.filter(
        (item) =>
          getProductId(item) !== getProductId(foundProduct)
      );

      filtered.unshift(foundProduct);

      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(
          filtered.slice(0, 6)
        )
      );
    } catch (error) {
      console.error(
        "Failed to fetch product:",
        error
      );
    }
  };

  fetchProduct();
}, [slug]);

  useEffect(() => {
    const storedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    if (!product) return;

    const storedReviews =
      getStoredReviews()[getProductId(product)] || [];
    const backendReviews =
      product.reviews || product.customerReviews || [];

    setReviews([...backendReviews, ...storedReviews]);
  }, [product]);

  if (!product) {
  return (
    <div
      style={{
        padding: "80px",
        textAlign: "center",
      }}
    >
      Loading Product...
    </div>
  );
}

  const featuredProducts = allProducts
  .filter(
    (item) =>
      item.isBestSeller &&
      getProductId(item) !== getProductId(product)
  )
  .slice(0, 4);

const relatedProducts = allProducts
  .filter(
    (item) =>
      getCategorySlug(item) ===
        getCategorySlug(product) &&
      getProductId(item) !== getProductId(product)
  )
  .slice(0, 4);

  const recentlyViewed =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("recentlyViewed")
        ) || []
      : [];

  const toggleWishlist = () => {
  const { wishlist: updatedWishlist } = toggleProductWishlist(product);
  setWishlist(updatedWishlist);
};

  const isWishlisted = wishlist.some(
    (item) => getProductId(item) === getProductId(product)
  );

  const handleAddToCart = () => {
  const result = addProductToCart(product, qty, { size: selectedSize });
  if (result.ok) setIsInCart(true);
  return result.ok;
};

const handleRemoveFromCart = () => {
  removeProductFromCart(product);
  setIsInCart(false);
};

  const handleBuyNow = () => {
    if (!handleAddToCart()) return;

    router.push("/cart");
  };

  const checkDelivery = () => {
    if (pincode.length !== 6) {
      setDeliveryMsg(
        "Please enter a valid pincode."
      );

      return;
    }

    setDeliveryMsg(
      "✓ Delivery available in your area."
    );
  };

  const submitReview = (e) => {
    e.preventDefault();

    if (
      !reviewForm.name ||
      !reviewForm.comment
    )
      return;

    const newReview = {
      ...reviewForm,
      rating: Number(reviewForm.rating) || 5,
      createdAt: new Date().toISOString(),
    };

    const reviewsByProduct = getStoredReviews();
    const productId = getProductId(product);

    reviewsByProduct[productId] = [
      ...(reviewsByProduct[productId] || []),
      newReview,
    ];

    saveStoredReviews(reviewsByProduct);
    setReviews([...reviews, newReview]);

    setReviewForm({
      name: "",
      rating: 5,
      comment: "",
    });

    showToast("cart", "Review submitted successfully");
  };
  return (
  <div className={styles.container}>
    
    {/* SUCCESS POPUP */}
    {toast.show && (
  <div
    className={`${styles.toast}
      ${styles[toast.type]}`}
  >
    <div className={styles.toastIcon}>
      {toast.type === "cart" && "🛒"}

      {toast.type === "wishlist" && "❤️"}

      {toast.type === "remove" && "💔"}
    </div>

    <div className={styles.toastContent}>
      <h4>
        {toast.type === "cart" &&
          "Added To Cart"}

        {toast.type === "wishlist" &&
          "Wishlist Updated"}

        {toast.type === "remove" &&
          "Wishlist Updated"}
      </h4>

      <p>{toast.message}</p>
    </div>
  </div>
)}

    {/* PRODUCT SECTION */}

    <div className={styles.productSection}>

      {/* LEFT SIDE */}

      <div className={styles.gallerySection}>

        {/* DESKTOP IMAGE */}

        <div className={styles.mainImageWrapper}>
          {product.video && mainImg === product.video ? (
            <video
              src={product.video}
              controls
              className={styles.mainVideo}
            />
          ) : (
            <Image
              src={getImageUrl(mainImg)}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className={styles.mainImage}
            />
          )}
        </div>

        {/* THUMBNAILS */}

        <div className={styles.thumbnailRow}>
          {getProductImages(product).map((img, index) => (
            <div
              key={index}
              className={`${styles.thumbWrapper}
              ${mainImg === img ? styles.activeThumb : ""}`}
            >
              <Image
                src={getImageUrl(img)}
                alt={product.name}
                width={90}
                height={90}
                className={styles.thumbnail}
                onClick={() => setMainImg(img)}
              />
            </div>
          ))}
          {product.video && (
            <button
              type="button"
              className={styles.videoThumb}
              onClick={() => setMainImg(product.video)}
            >
              Video
            </button>
          )}
        </div>

        {/* MOBILE SWIPER */}

        <div className={styles.mobileGallery}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
          >
            {getProductImages(product).map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={getImageUrl(img)}
                  alt={product.name}
                  width={700}
                  height={700}
                  className={styles.swiperImage}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className={styles.detailsSection}>

        {/* BRAND */}

        <span className={styles.brand}>
          {product.brand}
        </span>

        {/* TITLE */}

        <div className={styles.titleRow}>
          <h1>{product.name}</h1>

          <button
            className={styles.wishlistBtn}
            onClick={toggleWishlist}
          >
            {isWishlisted ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>

        {/* RATING */}

        <div className={styles.rating}>
          {"★".repeat(Math.round(product.rating || 5))}

          <span>
            ({reviews.length} Reviews)
          </span>
        </div>

        {/* PRICE */}

        <div className={styles.priceRow}>
          <h2>₹{product.price}</h2>

          <span className={styles.oldPrice}>
            ₹{Math.round(
  product.price /
  (1 - (product.discount || 0) / 100)
)}
          </span>

          <span className={styles.discount}>
            20% OFF
          </span>
        </div>

        {/* DESCRIPTION */}

        <p className={styles.description}>
          {product.description}
        </p>

        {/* SIZE */}

        <div className={styles.sizeSection}>
          <h4>Select Size</h4>

          <div className={styles.sizeGrid}>
            {product.sizes?.map((size) => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSize(size)
                }
                className={`${styles.sizeBtn}
                ${
                  selectedSize === size
                    ? styles.activeSize
                    : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* QUANTITY */}

        <div className={styles.qtyWrapper}>
          <h4>Quantity</h4>

          <div className={styles.qtyBox}>
            <button
              onClick={() =>
                qty > 1 &&
                setQty(qty - 1)
              }
            >
              -
            </button>

            <span>{qty}</span>

            <button
              onClick={() =>
                setQty(qty + 1)
              }
            >
              +
            </button>
          </div>
        </div>

        {/* BUTTONS */}

        <div className={styles.actionButtons}>
          <button
  onClick={
    isInCart
      ? handleRemoveFromCart
      : handleAddToCart
  }
  className={`${styles.addCartBtn}
  ${
    isInCart
      ? styles.addedCartBtn
      : ""
  }`}
>
  {isInCart
    ? "✓ Added To Cart"
    : "Add To Cart"}
</button>

          <button
            onClick={handleBuyNow}
            className={styles.buyNowBtn}
          >
            Buy Now
          </button>
        </div>

        {/* DELIVERY CHECK */}

        <div className={styles.deliveryBox}>
          <h4>Check Delivery</h4>

          <div className={styles.deliveryInput}>
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value)
              }
            />

            <button
              onClick={checkDelivery}
            >
              Check
            </button>
          </div>

          {deliveryMsg && (
            <p className={styles.deliveryMsg}>
              {deliveryMsg}
            </p>
          )}
        </div>

        {/* TRUST BADGES */}

        <div className={styles.trustBadges}>

          <div>
            <FaTruck />
            <span>
              Free Shipping
            </span>
          </div>

          <div>
            <FaUndo />
            <span>
              Easy Returns
            </span>
          </div>

          <div>
            <FaShieldAlt />
            <span>
              Secure Payments
            </span>
          </div>

          <div>
            <FaCheckCircle />
            <span>
              Quality Assured
            </span>
          </div>

        </div>

      </div>
    </div>
        {/* PRODUCT TABS */}

    <div className={styles.tabsSection}>

      <div className={styles.tabsHeader}>
        <button
          onClick={() => setActiveTab("description")}
          className={
            activeTab === "description"
              ? styles.activeTab
              : ""
          }
        >
          Description
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={
            activeTab === "shipping"
              ? styles.activeTab
              : ""
          }
        >
          Shipping
        </button>

        <button
          onClick={() => setActiveTab("care")}
          className={
            activeTab === "care"
              ? styles.activeTab
              : ""
          }
        >
          Care Guide
        </button>
      </div>

      <div className={styles.tabContent}>

        {activeTab === "description" && (
          <div>
            <h3>Product Description</h3>

            <p>{product.description}</p>

            <ul>
              <li>Premium Cotton Fabric</li>
              <li>Breathable Material</li>
              <li>Streetwear Inspired Design</li>
              <li>Comfort Fit</li>
              <li>Long Lasting Print Quality</li>
            </ul>
          </div>
        )}

        {activeTab === "shipping" && (
          <div>
            <h3>Shipping Information</h3>

            <p>{product.shipping}</p>

            <ul>
              <li>Free Shipping Across India</li>
              <li>3-7 Business Days Delivery</li>
              <li>Order Tracking Available</li>
              <li>Cash On Delivery Available</li>
            </ul>
          </div>
        )}

        {activeTab === "care" && (
          <div>
            <h3>Wash & Care</h3>

            <p>{product.care}</p>

            <ul>
              <li>Machine Wash Cold</li>
              <li>Do Not Bleach</li>
              <li>Iron On Low Heat</li>
              <li>Wash Similar Colors Together</li>
            </ul>
          </div>
        )}

      </div>
    </div>

    {/* CUSTOMER REVIEWS */}

    <div className={styles.reviewSection}>

      <div className={styles.sectionTitle}>
        <h2>Customer Reviews</h2>
      </div>

      <div className={styles.reviewGrid}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className={styles.reviewCard}
          >
            <div className={styles.reviewStars}>
              {"★".repeat(review.rating)}
            </div>

            <h4>{review.name}</h4>

            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      {/* REVIEW FORM */}

      <form
        onSubmit={submitReview}
        className={styles.reviewForm}
      >
        <h3>Write a Review</h3>

        <input
          type="text"
          placeholder="Your Name"
          value={reviewForm.name}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              name: e.target.value,
            })
          }
        />

        <select
          value={reviewForm.rating}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              rating: e.target.value,
            })
          }
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Star{rating > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <textarea
          rows={5}
          placeholder="Write your review..."
          value={reviewForm.comment}
          onChange={(e) =>
            setReviewForm({
              ...reviewForm,
              comment: e.target.value,
            })
          }
        />

        <button type="submit">
          Submit Review
        </button>
      </form>
    </div>

    {/* FEATURED PRODUCTS */}

    {/* FEATURED PRODUCTS */}
<div className={styles.featuredSection}>
  <div className={styles.sectionTitle}>
    <h2>Featured Products</h2>
    <p>Our Best Selling Collection</p>
  </div>
  <div className={styles.productGrid}>
    {featuredProducts.map((item) => {
      const discounted = item.discount
        ? Math.round(item.price - (item.price * item.discount) / 100)
        : item.price;
      const oldPrice = item.discount ? item.price : null;
      return (
        <Link
          href={`/product/${getProductSlug(item)}`}
          key={getProductId(item)}
          className={styles.productCard}
        >
          <div className={styles.productImageWrap}>
            <Image
              src={getImageUrl(getProductImages(item)[0])}
              alt={item.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className={styles.productImage}
            />
          </div>
          <div className={styles.productInfo}>
            <p className={styles.productBrand}>{item.brand || "Doppey"}</p>
            <p className={styles.productName}>{item.name}</p>
            <div className={styles.productPriceRow}>
              <span className={styles.productCurrentPrice}>₹{discounted}</span>
              {oldPrice && <span className={styles.productOldPrice}>₹{oldPrice}</span>}
              {item.discount > 0 && (
                <span className={styles.productDiscount}>{item.discount}% off</span>
              )}
            </div>
            {item.rating > 0 && (
              <div className={styles.cardStars}>
                {"★".repeat(Math.round(item.rating))}
              </div>
            )}
          </div>
        </Link>
      );
    })}
  </div>
</div>

{/* RELATED PRODUCTS */}
<div className={styles.relatedSection}>
  <div className={styles.sectionTitle}>
    <h2>You May Also Like</h2>
    <p>Similar Products</p>
  </div>
  <div className={styles.productGrid}>
    {relatedProducts.map((item) => {
      const discounted = item.discount
        ? Math.round(item.price - (item.price * item.discount) / 100)
        : item.price;
      const oldPrice = item.discount ? item.price : null;
      return (
        <Link
          href={`/product/${getProductSlug(item)}`}
          key={getProductId(item)}
          className={styles.productCard}
        >
          <div className={styles.productImageWrap}>
            <Image
              src={getImageUrl(getProductImages(item)[0])}
              alt={item.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className={styles.productImage}
            />
          </div>
          <div className={styles.productInfo}>
            <p className={styles.productBrand}>{item.brand || "Doppey"}</p>
            <p className={styles.productName}>{item.name}</p>
            <div className={styles.productPriceRow}>
              <span className={styles.productCurrentPrice}>₹{discounted}</span>
              {oldPrice && <span className={styles.productOldPrice}>₹{oldPrice}</span>}
              {item.discount > 0 && (
                <span className={styles.productDiscount}>{item.discount}% off</span>
              )}
            </div>
            {item.rating > 0 && (
              <div className={styles.cardStars}>
                {"★".repeat(Math.round(item.rating))}
              </div>
            )}
          </div>
        </Link>
      );
    })}
  </div>
</div>

{/* RECENTLY VIEWED */}
{recentlyViewed.length > 1 && (
  <div className={styles.recentSection}>
    <div className={styles.sectionTitle}>
      <h2>Recently Viewed</h2>
    </div>
    <div className={styles.productGrid}>
      {recentlyViewed
        .filter((item) => getProductId(item) !== getProductId(product))
        .slice(0, 4)
        .map((item) => {
          const discounted = item.discount
            ? Math.round(item.price - (item.price * item.discount) / 100)
            : item.price;
          const oldPrice = item.discount ? item.price : null;
          return (
            <Link
              href={`/product/${getProductSlug(item)}`}
              key={getProductId(item)}
              className={styles.productCard}
            >
              <div className={styles.productImageWrap}>
                <Image
                  src={getImageUrl(getProductImages(item)[0])}
                  alt={item.name}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className={styles.productImage}
                />
              </div>
              <div className={styles.productInfo}>
                <p className={styles.productBrand}>{item.brand || "Doppey"}</p>
                <p className={styles.productName}>{item.name}</p>
                <div className={styles.productPriceRow}>
                  <span className={styles.productCurrentPrice}>₹{discounted}</span>
                  {oldPrice && <span className={styles.productOldPrice}>₹{oldPrice}</span>}
                  {item.discount > 0 && (
                    <span className={styles.productDiscount}>{item.discount}% off</span>
                  )}
                </div>
                {item.rating > 0 && (
                  <div className={styles.cardStars}>
                    {"★".repeat(Math.round(item.rating))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
    </div>
  </div>
)}

  </div>
);}