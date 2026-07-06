import BannerSection from "@/components/Home/BannerSection";
import HeroSection from "@/components/Home/HeroSection";
import NewArrivals from "@/components/Home/NewArrivals";
import NewsletterSection from "@/components/Home/NewsLetter";
import ProductSection from "@/components/Home/ProductSection";
import ShopCategories from "@/components/Home/ShopCategories";

import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
// import TrendingCategories from "@/components/Home/TrendingCategories";
import LifestyleSection from "@/components/Home/LifestyleSection";
import BrandStorySection from "@/components/Home/BrandStorySection";
import InstagramSection from "@/components/Home/InstagramSection";
import ReviewSection from "@/components/Home/ReviewSection";
import TrustFeatures from "@/components/Home/TrustFeatures";

export default function Home() {
useEffect(() => {
AOS.init({
duration: 800,
once: true,
});
}, []);

return (
<> <Head> <title>Doppey | Premium Fashion & Streetwear</title>

```
    <meta
      name="description"
      content="Discover premium streetwear, oversized t-shirts, hoodies and fashion essentials at Doppey."
    />

    <meta
      name="keywords"
      content="streetwear, oversized t-shirts, hoodies, fashion, doppey"
    />

    <meta name="author" content="Doppey" />

    <link
      rel="canonical"
      href="https://www.doppey.com/"
    />

    <meta
      property="og:title"
      content="Doppey | Premium Fashion & Streetwear"
    />

    <meta
      property="og:description"
      content="Discover premium streetwear, oversized t-shirts, hoodies and fashion essentials at Doppey."
    />

    <meta
      property="og:type"
      content="website"
    />

    <meta
      property="og:url"
      content="https://www.doppey.com/"
    />

    <meta
      name="twitter:card"
      content="summary_large_image"
    />
  </Head>

  <main>
    <section data-aos="fade-up">
      <div className="container-fluid px-0">

       <HeroSection />



        {/* Features */}
        {/* <div className="container">
          <InfoSection />
        </div> */}

        {/* New Arrivals */}
        <div className="container">
          <NewArrivals />
        </div>

        {/* Trust Features */}
        <div className="container">
          <TrustFeatures />
        </div>

        <div className="container">
  <ShopCategories />
</div>

        {/* Fashion Banner */}
        <BannerSection />

        {/* LifestyleSection */}
        <div className="container">
          <LifestyleSection />
        </div>

        {/* Best Sellers */}
        <div className="container">
          <ProductSection />
        </div>

        {/* TrendingCategories */}
        {/* <div className="container">
          <TrendingCategories />
        </div> */}

          

          {/* BrandStorySection */}
        <div className="container">
          <BrandStorySection />
        </div>

        {/* Instagram section */}
        <div className="container">
          <InstagramSection />
        </div>

          {/* Review Section */}
        <div className="container">
          <ReviewSection />
        </div>

        {/* Newsletter */}
        {/* <NewsletterSection /> */}

      </div>
    </section>
  </main>
</>

);
}
