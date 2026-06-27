import '@/styles/globals.css';
// import Header from '@/components/Layout/Header';
// import Footer from '@/components/Layout/Footer';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Provider } from 'react-redux';
import { Red_Hat_Display } from 'next/font/google';
import Script from "next/script";
// import { useState, useRef, useEffect } from 'react';
// import WhatsApp from '@/components/Layout/Whatsapp';
// import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';
// import PopupForm from '@/components/Layout/PopupForm';
// import { toastData } from '@/constant/toastData.js';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useRouter } from 'next/router';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import MobileBottomNav from '../components/Layout/MobileBottomNav';
// import dynamic from 'next/dynamic';
import Head from 'next/head';
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from '@/components/Home/Header';
import Footer from '@/components/Home/Footer';
import TopHeader from '@/components/Home/TopHeader';
import Preloader from '@/components/Preloader';
import ShopToast from '@/components/ShopToast';

const redhat = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400', '700']
});

// config.autoAddCss = false;
// const SimpleForm = dynamic(() => import("../components/chatbot/SimpleForm"));

export default function App({ Component, pageProps }) {

  

  return (
    <main className={redhat.className}>
      <Script
    src="https://checkout.razorpay.com/v1/checkout.js"
    strategy="beforeInteractive"
  />
      <Head>
  <link rel="icon" href="/favicon.png" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/favicon.png" />

  <title>Doppey | Premium Fashion Store</title>

  <meta
    name="description"
    content="Shop premium fashion, oversized t-shirts, co-ord sets, cargo pants and more at Doppey."
  />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  />

  <meta
    name="theme-color"
    content="#000000"
  />

  <link
    rel="canonical"
    href="https://doppey.com"
  />

  <meta property="og:site_name" content="Doppey" />
  <meta property="og:title" content="Doppey" />
  <meta
    property="og:description"
    content="Premium fashion shopping at Doppey."
  />
  <meta
    property="og:image"
    content="https://doppey.com/favicon.png"
  />
</Head>

<Script
  id="doppey-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Doppey",
      url: "https://doppey.com",
      logo: "https://doppey.com/favicon.png",
    }),
  }}
/>
      {/* <Provider store={store}> */}
      <TopHeader/>
      <Preloader />
        <Header />
        <Component {...pageProps} />
        <ShopToast />
        {/* <MobileBottomNav /> */}
        {/* <WhatsApp /> */}
        {/* <div className="chatbot-container">
          <SimpleForm />
        </div> */}
        <Footer />
        {/* <Modal show={isOpen} size="lg" onHide={() => setIsOpen(false)} centered className="onetime_popup_modal">
        <ModalHeader closeButton>
        </ModalHeader>
          <Modal.Body className='px-4 pb-5'>
            <Form setIsOpen={setIsOpen} />
          </Modal.Body>
        </Modal>
        <CustomeToast ref={toastRef} timeout={5000} /> */}
      {/* </Provider> */}
      {/* <button className='enquiry-btn-cta' onClick={() => nowIsOpen(true)}>
                <strong>Enquire Now</strong>
            </button>
            <Modal show={nowOpen} centered onHide={() => nowIsOpen(false)}>
                <ModalHeader closeButton>
                </ModalHeader>
                <ModalBody className='px-4 pb-5'>
                    <Form />
                </ModalBody>
            </Modal> */}
    </main>
  );
}
