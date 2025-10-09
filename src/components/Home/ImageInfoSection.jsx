import React from "react";
import Image from "next/image";
import styles from "../../styles/ImageInfoSection.module.css";

const ImageInfoSection = () => {
  const infoData = [
    {
      img: "/home/info/first.jpg",
      title: "New Arrivals",
      desc: "Check out the latest collection for you",
      btnText: "Shop Now",
    },
    {
      img: "/home/info/first.jpg",
      title: "Exclusive Offers",
      desc: "Grab exciting discounts before they end!",
      btnText: "View Offers",
    },
    {
      img: "/home/info/first.jpg",
      title: "Trending Styles",
      desc: "Upgrade your wardrobe with trending looks",
      btnText: "Explore",
    },
  ];

  return (
    <section className={`container py-5 ${styles.imageInfoSection}`}>
      <div className="row g-4">
        {infoData.map((item, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className={styles.overlay}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <button>{item.btnText}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageInfoSection;
