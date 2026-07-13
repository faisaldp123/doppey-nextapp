import { useState, useEffect, useRef } from "react";
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

// ← Single helper used everywhere in this file
const getDiscountedPrice = (product) => {
  const base = Number(product?.price) || 0;
  return product?.discount
    ? Math.round(base - (base * product.discount) / 100)
    : base;
};

export default function ProductDetail() {
  const router = useRouter();
  const { id: slug } = router.query;

  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct]         = useState(null);
  const [mainImg, setMainImg]         = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [qty, setQty]                 = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [wishlist, setWishlist]       = useState([]);
  const [activeTab, setActiveTab]     = useState("description");
  const [isInCart, setIsInCart]       = useState(false);
  const [toast, setToast]             = useState({ show: false, type: "", message: "" });
  const [pincode, setPincode]         = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [reviews, setReviews]         = useState([]);
  const [reviewForm, setReviewForm] =
useState({
  name: "",
  comment: "",
});

const [reviewImages, setReviewImages] =
useState([]);

  // ← NEW: ref to the mobile Swiper instance, so thumbnail taps can move it
  const mainSwiperRef = useRef(null);
  // ← NEW: tracks timestamp of last tap, to detect double-tap for zoom
  const lastTapRef = useRef(0);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const res = await API.get(`/products/product/${slug}`);
        const foundProduct = res.data;

        const allProductsRes = await API.get("/products/public");
        setAllProducts(allProductsRes.data);

        setProduct(foundProduct);
        const imgs = getProductImages(foundProduct);

setMainImg(imgs[0] || "");
setCurrentImageIndex(0);

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const alreadyAdded = cart.some((item) => getProductId(item) === getProductId(foundProduct));
        setIsInCart(alreadyAdded);

        const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        const filtered = viewed.filter((item) => getProductId(item) !== getProductId(foundProduct));
        filtered.unshift(foundProduct);
        localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 6)));
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
  if (product) {
    setReviews(product.reviews || []);
  }
}, [product]);

  if (!product) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        Loading Product...
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(product);
  const originalPrice   = Number(product.price) || 0;
  const hasDiscount     = product.discount > 0;
  const isOutOfStock    = Number(product.stock) <= 0;

  const featuredProducts = allProducts
    .filter((item) => item.isBestSeller && getProductId(item) !== getProductId(product))
    .slice(0, 4);

  const relatedProducts = allProducts
    .filter((item) => getCategorySlug(item) === getCategorySlug(product) && getProductId(item) !== getProductId(product))
    .slice(0, 4);

  const recentlyViewed = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("recentlyViewed")) || []
    : [];

  const toggleWishlist = () => {
    const { wishlist: updatedWishlist } = toggleProductWishlist(product);
    setWishlist(updatedWishlist);
  };

  const isWishlisted = wishlist.some((item) => getProductId(item) === getProductId(product));

  const handleAddToCart = () => {
    if (isOutOfStock) return false;
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
      setDeliveryMsg("Please enter a valid pincode.");
      return;
    }
    setDeliveryMsg("✓ Delivery available in your area.");
  };

  const images = product ? getProductImages(product) : [];

const nextImage = () => {
  if (!images.length) return;

  const next =
    currentImageIndex >= images.length - 1
      ? 0
      : currentImageIndex + 1;

  setCurrentImageIndex(next);
  setMainImg(images[next]);
};

  // ← NEW: resets any active zoom (called whenever the visible image changes)
  const resetZoom = () => {
    setIsZooming(false);
    setZoomStyle({});
  };

  // ← Thumbnail click: updates state AND tells the mobile Swiper to move there
  const handleThumbnailClick = (img, index) => {
    setMainImg(img);
    setCurrentImageIndex(index);
    resetZoom();
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    }
  };

const handleMouseMove = (e) => {
  const rect =
    e.currentTarget.getBoundingClientRect();

  const x =
    ((e.clientX - rect.left) / rect.width) *
    100;

  const y =
    ((e.clientY - rect.top) / rect.height) *
    100;

  setZoomStyle({
    transformOrigin: `${x}% ${y}%`,
    transform: "scale(2.2)",
  });
};

const handleMouseEnter = () => {
  setIsZooming(true);
};

const handleMouseLeave = () => {
  setIsZooming(false);

  setZoomStyle({
    transform: "scale(1)",
  });
};

  // ← NEW: double-tap-to-zoom for touchscreens (mobile). Single taps are
  // left alone so Swiper's own swipe/tap handling isn't disturbed.
  const handleImageTouchEnd = (e) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      if (isZooming) {
        resetZoom();
      } else {
        const touch = e.changedTouches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        setZoomStyle({
          transformOrigin: `${x}% ${y}%`,
          transform: "scale(2.2)",
        });
        setIsZooming(true);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  const submitReview = async (e) => {
  e.preventDefault();

  if (
    !reviewForm.name ||
    !reviewForm.comment
  )
    return;

  try {
    const formData = new FormData();

    formData.append(
      "name",
      reviewForm.name
    );

    formData.append(
      "comment",
      reviewForm.comment
    );

    reviewImages.forEach((img) => {
      formData.append(
        "images",
        img
      );
    });

    await API.post(
      `/products/${getProductId(product)}/review`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    const updated =
      await API.get(
        `/products/product/${slug}`
      );

    setProduct(updated.data);
    setReviews(
      updated.data.reviews || []
    );

    setReviewForm({
      name: "",
      comment: "",
    });

    setReviewImages([]);
    
    const fileInput =
  document.getElementById(
    "review-images"
  );

if (fileInput)
  fileInput.value = "";

    showToast(
      "cart",
      "Review submitted successfully"
    );
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className={styles.container}>

      {/* TOAST */}
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.toastIcon}>
            {toast.type === "cart"     && "🛒"}
            {toast.type === "wishlist" && "❤️"}
            {toast.type === "remove"   && "💔"}
          </div>
          <div className={styles.toastContent}>
            <h4>
              {toast.type === "cart"     && "Added To Cart"}
              {toast.type === "wishlist" && "Wishlist Updated"}
              {toast.type === "remove"   && "Wishlist Updated"}
            </h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {/* PRODUCT SECTION */}
      <div className={styles.productSection}>

        {/* LEFT — GALLERY */}
        <div className={styles.gallerySection}>

          <div
  className={styles.mainImageWrapper}
  onMouseMove={handleMouseMove}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
            {typeof window !== "undefined" &&
window.innerWidth <= 768 ? (
  <Swiper
    modules={[Pagination]}
    pagination={{ clickable: true }}
    slidesPerView={1}
    spaceBetween={0}
    onSwiper={(swiper) => {
      mainSwiperRef.current = swiper;
    }}
    onSlideChange={(swiper) => {
      const imgs = getProductImages(product);

      if (swiper.activeIndex < imgs.length) {
        setMainImg(imgs[swiper.activeIndex]);
        setCurrentImageIndex(swiper.activeIndex);
      }
      resetZoom();
    }}
    className={styles.mainSwiper}
  >
    {getProductImages(product).map((img, index) => (
      <SwiperSlide key={index}>
        <div
          className={styles.zoomWrapper}
          onTouchEnd={handleImageTouchEnd}
        >
          <Image
            src={getImageUrl(img)}
            alt={product.name}
            fill
            className={styles.mainImage}
            style={isZooming ? zoomStyle : {}}
          />
        </div>
      </SwiperSlide>
    ))}

    {product.video && (
      <SwiperSlide>
        <video
          src={product.video}
          controls
          className={styles.mainVideo}
        />
      </SwiperSlide>
    )}
  </Swiper>
) : (
  product.video && mainImg === product.video ? (
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
      style={isZooming ? zoomStyle : {}}
    />
  )
)}
          </div>

          <div className={styles.thumbnailRow}>
            {getProductImages(product).map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbWrapper} ${mainImg === img ? styles.activeThumb : ""}`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={product.name}
                  width={90}
                  height={90}
                  className={styles.thumbnail}
                  onClick={() => handleThumbnailClick(img, index)}
                />
              </div>
            ))}
            {product.video && (
              <button
                type="button"
                className={styles.videoThumb}
                onClick={() => {
                  setMainImg(product.video);
                  resetZoom();
                }}
              >
                Video
              </button>
            )}
          </div>

          <div className={styles.mobileGallery}>
  <Swiper
    modules={[Pagination]}
    pagination={{ clickable: true }}
    spaceBetween={0}
    slidesPerView={1}
    onSlideChange={(swiper) => {
      const img =
        getProductImages(product)[swiper.activeIndex];

      setMainImg(img);
      setCurrentImageIndex(swiper.activeIndex);
    }}
  >
    {getProductImages(product).map((img, index) => (
      <SwiperSlide key={index}>
        <Image
          src={getImageUrl(img)}
          alt={product.name}
          width={800}
          height={1000}
          className={styles.swiperImage}
          priority={index === 0}
        />
      </SwiperSlide>
    ))}

    {product.video && (
      <SwiperSlide>
        <video
          src={product.video}
          controls
          className={styles.mobileVideo}
        />
      </SwiperSlide>
    )}
  </Swiper>
</div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className={styles.detailsSection}>

          <span className={styles.brand}>{product.brand}</span>

          <div className={styles.titleRow}>
            <h1>{product.name}</h1>
            <button className={styles.wishlistBtn} onClick={toggleWishlist}>
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <div className={styles.rating}>
  <span>{reviews.length} Customer Reviews</span>
</div>

          {/* ← FIXED PRICE SECTION */}
          <div className={styles.priceRow}>
            <h2>₹{discountedPrice.toLocaleString("en-IN")}</h2>

            {hasDiscount && (
              <span className={styles.oldPrice}>
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}

            {hasDiscount && (
              <span className={styles.discount}>
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* <p className={styles.description}>{product.description}</p> */}

          <div className={styles.sizeSection}>
            <h4>Select Size</h4>
            <div className={styles.sizeGrid}>
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.qtyWrapper}>
            <h4>Quantity</h4>
            <div className={styles.qtyBox}>
              <button onClick={() => qty > 1 && setQty(qty - 1)} disabled={isOutOfStock}>-</button>
              <span>{qty}</span>
              <button onClick={() => qty < Number(product.stock) && setQty(qty + 1)} disabled={isOutOfStock || qty >= Number(product.stock)}>+</button>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
              className={`${styles.addCartBtn} ${isInCart ? styles.addedCartBtn : ""}`}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out Of Stock" : (isInCart ? "✓ Added To Cart" : "Add To Cart")}
            </button>
            <button onClick={handleBuyNow} className={styles.buyNowBtn} disabled={isOutOfStock}>
              Buy Now
            </button>
          </div>

          <div className={styles.deliveryBox}>
            <h4>Check Delivery</h4>
            <div className={styles.deliveryInput}>
              <input
                type="text"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button onClick={checkDelivery}>Check</button>
            </div>
            {deliveryMsg && <p className={styles.deliveryMsg}>{deliveryMsg}</p>}
          </div>

          <div className={styles.trustBadges}>
            <div><FaTruck /><span>Free Shipping</span></div>
            <div><FaUndo /><span>Easy Returns</span></div>
            <div><FaShieldAlt /><span>Secure Payments</span></div>
            <div><FaCheckCircle /><span>Quality Assured</span></div>
          </div>

        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabsSection}>
        <div className={styles.tabsHeader}>
          <button onClick={() => setActiveTab("description")} className={activeTab === "description" ? styles.activeTab : ""}>Description</button>
          <button onClick={() => setActiveTab("shipping")} className={activeTab === "shipping" ? styles.activeTab : ""}>Shipping</button>
          <button onClick={() => setActiveTab("care")} className={activeTab === "care" ? styles.activeTab : ""}>Care Guide</button>
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

      {/* REVIEWS */}
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
  {review.images?.length > 0 && (
    <div className={styles.reviewImageGallery}>
  {review.images?.length === 1 ? (
    <img
      src={getImageUrl(review.images[0])}
      className={styles.singleReviewImage}
      alt=""
    />
  ) : (
    review.images?.map((img, i) => (
      <img
        key={i}
        src={getImageUrl(img)}
        className={styles.reviewImage}
        alt=""
      />
    ))
  )}
</div>
  )}

  <div className={styles.reviewContent}>
    <div className={styles.reviewHeader}>
      <div>
        <h4>{review.name}</h4>
        <span className={styles.reviewVerified}>
          ✓ Verified Buyer
        </span>
      </div>

      <span className={styles.reviewDate}>
        {new Date(
          review.createdAt
        ).toLocaleDateString("en-IN")}
      </span>
    </div>

    <p className={styles.reviewComment}>
      {review.comment}
    </p>
  </div>
</div>
          ))}
        </div>

        <form onSubmit={submitReview} className={styles.reviewForm}>
          <h3>Write a Review</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
          />
          <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) =>
    setReviewImages(
      Array.from(e.target.files)
    )
  }
/>
          <textarea
            rows={5}
            placeholder="Write your review..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className={styles.featuredSection}>
        <div className={styles.sectionTitle}>
          <h2>Featured Products</h2>
          <p>Our Best Selling Collection</p>
        </div>
        <div className={styles.productGrid}>
          {featuredProducts.map((item) => {
            const d = getDiscountedPrice(item);
            return (
              <Link href={`/product/${getProductSlug(item)}`} key={getProductId(item)} className={styles.productCard}>
                <div className={styles.productImageWrap}>
                  <Image src={getImageUrl(getProductImages(item)[0])} alt={item.name} fill sizes="(max-width:768px) 50vw, 25vw" className={styles.productImage} />
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productBrand}>{item.brand || "Doppey"}</p>
                  <p className={styles.productName}>{item.name}</p>
                  <div className={styles.productPriceRow}>
                    <span className={styles.productCurrentPrice}>₹{d.toLocaleString("en-IN")}</span>
                    {item.discount > 0 && <span className={styles.productOldPrice}>₹{Number(item.price).toLocaleString("en-IN")}</span>}
                    {item.discount > 0 && <span className={styles.productDiscount}>{item.discount}% off</span>}
                  </div>
                  {item.rating > 0 && <div className={styles.cardStars}>{"★".repeat(Math.round(item.rating))}</div>}
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
            const d = getDiscountedPrice(item);
            return (
              <Link href={`/product/${getProductSlug(item)}`} key={getProductId(item)} className={styles.productCard}>
                <div className={styles.productImageWrap}>
                  <Image src={getImageUrl(getProductImages(item)[0])} alt={item.name} fill sizes="(max-width:768px) 50vw, 25vw" className={styles.productImage} />
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.productBrand}>{item.brand || "Doppey"}</p>
                  <p className={styles.productName}>{item.name}</p>
                  <div className={styles.productPriceRow}>
                    <span className={styles.productCurrentPrice}>₹{d.toLocaleString("en-IN")}</span>
                    {item.discount > 0 && <span className={styles.productOldPrice}>₹{Number(item.price).toLocaleString("en-IN")}</span>}
                    {item.discount > 0 && <span className={styles.productDiscount}>{item.discount}% off</span>}
                  </div>
                  {item.rating > 0 && <div className={styles.cardStars}>{"★".repeat(Math.round(item.rating))}</div>}
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
                const d = getDiscountedPrice(item);
                return (
                  <Link href={`/product/${getProductSlug(item)}`} key={getProductId(item)} className={styles.productCard}>
                    <div className={styles.productImageWrap}>
                      <Image src={getImageUrl(getProductImages(item)[0])} alt={item.name} fill sizes="(max-width:768px) 50vw, 25vw" className={styles.productImage} />
                    </div>
                    <div className={styles.productInfo}>
                      <p className={styles.productBrand}>{item.brand || "Doppey"}</p>
                      <p className={styles.productName}>{item.name}</p>
                      <div className={styles.productPriceRow}>
                        <span className={styles.productCurrentPrice}>₹{d.toLocaleString("en-IN")}</span>
                        {item.discount > 0 && <span className={styles.productOldPrice}>₹{Number(item.price).toLocaleString("en-IN")}</span>}
                        {item.discount > 0 && <span className={styles.productDiscount}>{item.discount}% off</span>}
                      </div>
                      {item.rating > 0 && <div className={styles.cardStars}>{"★".repeat(Math.round(item.rating))}</div>}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
}
