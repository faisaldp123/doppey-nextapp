// components/RareSection.js
import React from 'react';
import styles from '../../styles/RareSection.module.css';

const RareSection = () => {
  return (
    <section className={`container-fluid mb-5 ${styles.rareSection}`}>
      <div className="row g-0">
        {/* Left Text Section */}

        {/* Image Section */}
        <div className="col-12 col-md-9">
          <div className="row g-0 h-100">
            {/* Main Large Image */}
            <div className="col-12 col-md-8">
              <img
                src="/rare/big-one.webp"
                alt="Man in desert"
                className="img-fluid w-900 h-100 object-fit-cover"
              />
            </div>

            {/* Two Smaller Images */}
            <div className="col-12 col-md-4">
              <div className="row g-0 h-100">
                <div className="col-12" style={{ height: '50%' }}>
                  <img
                    src="/products/product-one.jpg"
                    alt="Boy at fence"
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="col-12" style={{ height: '50%' }}>
                  <img
                    src="/products/product-two.jpg"
                    alt="Woman jumping"
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 d-flex align-items-center justify-content-center bg-white text-center p-4">
          <div>
            <h5 className={styles.subheading}>THE HOUSE OF</h5>
            <h1 className={styles.heading}>Doppey</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RareSection;
