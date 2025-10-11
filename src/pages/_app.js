import '@/styles/globals.css';
// import Header from '@/components/Layout/Header';
// import Footer from '@/components/Layout/Footer';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Provider } from 'react-redux';
import { Red_Hat_Display } from 'next/font/google';
// import { useState, useRef, useEffect } from 'react';
// import WhatsApp from '@/components/Layout/Whatsapp';
// import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';
// import PopupForm from '@/components/Layout/PopupForm';
// import { toastData } from '@/constant/toastData.js';
// import "@fortawesome/fontawesome-svg-core/styles.css";
import { useRouter } from 'next/router';
// import MobileBottomNav from '@/components/Layout/MobileBottomNav';
// import dynamic from 'next/dynamic';
import Head from 'next/head';
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from '@/components/Home/Header';
import Footer from '@/components/Home/Footer';
import TopHeader from '@/components/Home/TopHeader';

const redhat = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['400', '700']
});

// config.autoAddCss = false;
// const SimpleForm = dynamic(() => import("../components/chatbot/SimpleForm"));

export default function App({ Component, pageProps }) {

  

  return (
    <main className={redhat.className}>
      <Head>
        {/* Add the favicon here */}
        <link rel="icon" href="/final-new-fevicon.png" />
        {/* Optionally, you can use a PNG or other file type */}
        {/* <link rel="icon" href="/favicon.png" /> */}
        <title>Doppey shopping app</title> {/* Optional title change */}
        <meta name="description" content="Doppey shopping app"/>
      </Head>
      {/* <Provider store={store}> */}
      <TopHeader/>
        <Header />
        <Component {...pageProps} />
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