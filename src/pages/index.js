// import Approvals from '@/components/Home/Approvals'
// import Compare from '@/components/Home/Compare'
// import HeroSlider from '@/components/Home/HeroSection'
// import InfoImage from '@/components/Home/InfoImage'
// import InstantCounselling from '@/components/Home/InstantCounselling'
// import MobileApp from '@/components/Home/MobileApp'
// import Process from '@/components/Home/Process'
// import QuestionSection from '@/components/Home/QuestionSection'
// import Rating from '@/components/Home/Rating'
// import TalkToExperts from '@/components/Home/TalkToExperts'
// import { Inter } from 'next/font/google'
// import WhoWeAre from '@/components/Home/WhoWeAre'
import BannerSection from '@/components/Home/BannerSection'
import HeroSection from '@/components/Home/HeroSection'
import ImageInfoSection from '@/components/Home/ImageInfoSection'
import InfoSection from '@/components/Home/InfoSection'
import NewArrivals from '@/components/Home/NewArrivals'
import NewsletterSection from '@/components/Home/NewsLetter'
import ProductSection from '@/components/Home/ProductSection'
import RareSection from '@/components/Home/RareSection'
import Head from 'next/head'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        {/* SEO Meta Tags */}
        <title>Doppey shopping app</title>
        <meta
          name="description"
          content="Admission Panel helps students choose right college, course & career with expert counseling, university selection & admission guidance. Build your future today!"
        />
        <meta name="keywords" content="Online education, career counseling, admission panel, best colleges in India, distance learning, online universities" />
        <meta name="author" content="Admission Panel" />
        <link rel="canonical" href="https://www.admissionpanel.com/" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Admission Panel - Your Gateway to Online Education" />
        <meta property="og:description" content="Admission Panel helps students choose right college, course & career with expert counseling, university selection & admission guidance. Build your future today!" />
        <meta property="og:site_name" content="Admission Panel" />
        <meta property="og:url" content="https://www.admissionpanel.com/" />
        <meta property="og:image" content="https://www.admissionpanel.com/_next/image?url=%2Fimages%2Flogo%2Fadmission-logo-new.png&w=256&q=75" />
        <meta property="og:image:alt" content="Admission Panel - Your Gateway to Online Education" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Admission Panel - Your Gateway to Online Education" />
        <meta name="twitter:description" content="Admission Panel helps students choose right college, course & career with expert counseling, university selection & admission guidance. Build your future today!" />
        <meta name="twitter:image" content="https://www.admissionpanel.com/_next/image?url=%2Fimages%2Flogo%2Fadmission-logo-new.png&w=256&q=75" />
        <meta name="twitter:image:alt" content="Admission Panel - Your Gateway to Online Education" />

        {/* Organization Schema */}

    
      </Head>
      <main>
        <div className="container-fluid px-0">
          <HeroSection/>
          <div className="container">
            {/* <InfoSection/> */}
            <ProductSection/>
            
          </div>
          <BannerSection/>
          <div className='container'>
            <NewArrivals/>
            <ImageInfoSection/>
            <RareSection/>
          </div>
          <NewsletterSection/>
          {/* <InstantCounselling /> */}
          {/* <TalkToExperts /> */}
          {/* <div className="container">
            <QuestionSection /> */}
          {/* </div> */}
        </div>
      </main>
    </>
  )
}