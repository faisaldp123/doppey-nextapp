import React from 'react';
import styles from "@/styles/components/MobileBottomNav.module.css";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faHouse, faMagnifyingGlass, faCodeCompare, faHeart } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const MobileBottomNav = () => {

  return (
    <div className={styles.bottom_nav}>
      <Link href="/" className='text-brand d-flex flex-column align-items-center'>
        <FontAwesomeIcon icon={faHouse} />
        <small>Home</small>
      </Link>
      <Link href="/" className='text-brand d-flex flex-column align-items-center border-0 bg-white'>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <small>Search</small>
      </Link>
      <Link href="/apply-now" className='text-brand position-relative text-center'>
        <span className={styles.enquire_now}>Enquire</span>
        <Image src="/images/icons/apply-icon.webp" alt="apply icon" height={27} width={27} />
      </Link>
      <a href="https://wa.me/+919873636520" rel='noopener' target='_blank' className='text-brand position-relative text-center'>
        {/* <span className={styles.whatsapp_btn}> WhatsApp</span> */}
        <FontAwesomeIcon className="fa-brands fa-whatsapp text-whatsapp" icon={faHeart} />
      </a>
      <div className='position-relative'>
        <Link href="/compare" className='text-brand d-flex flex-column align-items-center'>
          <FontAwesomeIcon className="fas fa-solid fa-code-compare" icon={faCodeCompare} />
          <small>Compare</small>
        </Link>
      </div>
    </div>
  );
}

export default MobileBottomNav;
