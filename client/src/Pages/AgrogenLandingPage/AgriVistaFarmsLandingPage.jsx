import { memo } from 'react';
import { Link } from 'react-router-dom';
import resets from '../_resets.module.css';
import classes from './AgriVistaFarmsLandingPage.module.css';
import { AgrivistaFarmsLandingPageIcon2} from './AgrivistaFarmsLandingPageIcon2.jsx';
import {AgrivistaFarmsLandingPageIcon} from './AgrivistaFarmsLandingPageIcon.jsx';

import {Check} from './Check/Check.jsx';
import {Ellipse1Icon} from './Ellipse1Icon.jsx';
import {Ellipse2Icon} from './Ellipse2Icon.jsx';
import {Ellipse3Icon} from './Ellipse3Icon.jsx';
import {Group143Icon} from './Group143Icon.jsx';
import {Group145Icon} from './Group145Icon.jsx';
import {GroupIcon} from './GroupIcon.jsx';
import {GroupIcon2} from './GroupIcon2.jsx';
import { Groups } from './Groups/Groups';
import { ProductIcon } from './ProductIcon.jsx';
import { Star_rate2 } from './Star_rate2/Star_rate2';
import { Star_rate } from './Star_rate/Star_rate';
import { VectorIcon } from './VectorIcon.jsx';

 const AgriVistaFarmsLandingPage = memo(function AgriVistaFarmsLandingPage(props) {
  return (
    <div>
    <div className={`${resets.storybrainResets} ${classes.root}`}  >
      {/* <div className={classes.rectangle42}></div>
      <div className={classes.rectangle41}></div>
      <div className={classes.rectangle40}></div> */}
      <div className={classes.image1} style={{backgroundImage: 'url("https://www.shutterstock.com/image-photo/farmer-using-tablet-standing-wheat-600nw-1767436760.jpg")'}}></div>
      <div className={classes.image2}></div>
      <div className={classes.helplineNo1552611124300606}>Helpline no. 155261 / 011-24300606</div>
      <div className={classes.deliveryPartner}>DeliveryPartner</div>
      <div className={classes.agroGen}>AgroGen</div>
      <div className={classes.home}>Home</div>
      <div className={classes.guidelines}>Guidelines</div>
      <div className={classes.rectangle4}></div>
      <div className={classes.rectangle7}></div>
      <Link to="/chooser">
      <div className={classes.login}>Login</div>
      </Link>
      <Link to="/chooser">
      <div className={classes.signUp}>Sign Up</div>
      </Link>
      <div className={classes.theRevolutionaryImpactOfTechno}>
        The Revolutionary Impact of Technology on Agriculture
      </div>
      <div className={classes.rectangle9}></div>
      <Link to="/helpline">
      <div className={classes.getStarted}>Get Started</div>
      </Link>
      <div className={classes.rectangle8}></div>
      <div className={classes.learnMore}>Learn More</div>

      <div className={classes.atAgrogenWeVeCreatedASimplePla}>
        At Agrogen, we&#39;ve created a simple place that connects hardworking farmers with careful buyers and vendors.
        Our easy-to-use design ensures a straightforward and honest experience, promoting a direct and sincere
        connection in every&nbsp;transaction.
      </div>
      <div className={classes.aboutUs}>About Us  Work With Us</div>
      <div className={classes.image4}></div> 
      <div className={classes.rectangle43}></div>
      <div className={classes.rectangle10}></div>
      <div className={classes.rectangle72}></div>
      <button className={classes.learnMore2}>Learn More</button>
      <div className={classes.rectangle82}></div>
      <div className={classes.contactUs}>Contact Us</div>
      <div className={classes.cultivateSuccessMasterCropPlan}>
        Cultivate Success: Master Crop Planning for Abundant Harvests!
      </div>
      <div className={classes.ourBlog}>Our Blog</div>
      <div className={classes.weAlsoOfferInsightsThroughOurB}>
        We also offer insights through our blog, keeping you informed about the latest agricultural trends, best
        practices, and success stories. Stay connected for valuable industry knowledge.
      </div>
      <div className={classes.innovationsForAGreenerFuture}>Innovations for a Greener Future</div>
      <div className={classes.discoverTheInnovationsForAGree}>
        Discover the innovations for a greener future, transforming agriculture sustainably.
      </div>
      <div className={classes.readMore}>Read More</div>
      <div className={classes.rectangle102} style={{backgroundImage: 'url("https://img.freepik.com/free-photo/high-angle-avocados-tomatoes-peppers-tray_23-2148685402.jpg")'}}></div>
      <div className={classes.thePowerOfAgriculturalAnalytic}>
        <div className={classes.textBlock}>The Power of </div>
        <div className={classes.textBlock2}>Agricultural Analytics</div>
      </div>
      <div className={classes.precisionInsightsForAgricultur}>
        Precision insights for agriculture: Enhance productivity with data-driven analysis solutions.
      </div>
      <div className={classes.readMore2}>Read More</div>
      <div className={classes.rectangle11} style={{backgroundImage: 'url("https://www.shutterstock.com/image-photo/farmer-using-tablet-standing-wheat-600nw-1767436760.jpg")'}}></div>
      <div className={classes.rectangle12} style={{backgroundImage: 'url("https://t3.ftcdn.net/jpg/01/67/18/20/360_F_167182087_xSJL6Bb1P0GdX3MHTkCafNjbVGmHtE3h.jpg")'}}></div>
      <div className={classes.ourStoryAndJourneyTowardsYou}>Our Story and Journey towards you </div>
      <div className={classes.unveilingOurJourneyAgrogenSSto}>
        Unveiling our journey: Agrogen&#39;s story cultivating innovation for you, sustainably and Efficiently.
      </div>
      <div className={classes.readMore3}>Read More</div>
      <div className={classes.rectangle5} ></div>
      <div className={classes.theBenefitsOfChoosingUs}>The Benefits of Choosing Us</div>
      <div className={classes.whyUs}>Why Us ?</div>
      <div className={classes.optingForUsGuaranteesEasyAcces}>
        Opting for us guarantees easy access to farmers, real-time market insights, streamlined transactions, and unique
        part-time job opportunities. Without us, you risk missing simplified processes, transparency, and inclusive
        earning options.
      </div>
      <div className={classes.rectangle92}></div>
      <button className={classes.learnMore3}>Learn More</button>
      <div className={classes.vector}>
        <VectorIcon className={classes.icon} />
      </div>
      <div className={classes.transparentAndFasterPayments}>Transparent and Faster Payments</div>
      <div className={classes.ellipse3}>
        <Ellipse3Icon className={classes.icon2} />
      </div>
      <Check />
      <div className={classes.saferEarningOptions}>Safer Earning Options</div>
      <div className={classes.product}>
        <ProductIcon className={classes.icon3} />
      </div>
      <div className={classes.realTimeMarketInsights}>Real time market insights</div>
      <div className={classes.ellipse2}>
        <Ellipse2Icon className={classes.icon4} />
      </div>
      <Star_rate />
      <div className={classes._5}>5</div>
      <div className={classes.coreTeamMembers}>Core Team Members</div>
      <div className={classes.ellipse1}>
        <Ellipse1Icon className={classes.icon5} />
      </div>
      <Groups />
      <div className={classes.seeAllProducts}>See all products</div>
      <div className={classes.ourFeaturedProduct}>Our Featured Product</div>
      <div className={classes.indulgeInATomatoLoverSParadise}>
        Indulge in a tomato lover&#39;s paradise with our diverse selection! Choose from a tantalizing array of tomatoes
        to elevate your culinary experience.
      </div>
      <div className={classes.rectangle103} ></div>
      <div className={classes.rectangle104} style={{backgroundImage: 'url("https://5.imimg.com/data5/QM/AG/JI/SELLER-89932137/beans-500x500.jpg")'}}></div>
      <div className={classes.beans}>Beans</div>
      <div className={classes.rate2732FromMaharashtraKarnata}>
        <div className={classes.textBlock3}>Rate : ₹273.02</div>
        <div className={classes.textBlock4}>From Maharashtra, Karnataka, and Tamil Nadu</div>
      </div>
      <div className={classes.rectangle105}></div>
      <div className={classes.rectangle122} style={{backgroundImage:'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Y9pqCyhsfmU7-yLImvR2ZdCVyc5LsvlkjQ&usqp=CAU")'}}></div>
      <div className={classes.grapeTomato}>Grape Tomato</div>
      <div className={classes.rate115FromMaharashtraKarnatak}>
        <div className={classes.textBlock5}>Rate : ₹115</div>
        <div className={classes.textBlock6}>From Maharashtra, Karnataka, and Tamil Nadu</div>
      </div>
      <div className={classes.rectangle106} ></div>
      <div className={classes.brinjal}>Brinjal</div>
      <div className={classes.rate47FromWestBengalUttarPrade}>
        <div className={classes.textBlock7}>Rate : ₹47</div>
        <div className={classes.textBlock8}>From West Bengal, Uttar Pradesh, and Karnataka</div>
      </div>
      <div className={classes.rectangle123} style={{backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL4m2V56j5JFwfPtgbFFSimLoHduXCRVLISQ29VIEbfnZ53q4FwNpoecuAKWJUDFDiAG4&usqp=CAU")'}}></div>
      <div className={classes.rectangle107} ></div>
      <div className={classes.okra}>Okra</div>
      <div className={classes.rate129FromChhattisgarhBiharTe}>
        <div className={classes.textBlock9}>Rate : ₹129</div>
        <div className={classes.textBlock10}>From Chhattisgarh, Bihar, Telangana, Odisha and TamilNadu</div>
      </div>
      <div className={classes.rectangle13} style={{backgroundImage: 'url("https://ronmayhewphotography.com/wp-content/uploads/2022/06/A-Bunch-of-Okra-.jpg")'}}></div>
      <div className={classes.rectangle124}></div>
      <div className={classes.pages}>Pages</div>
      <div className={classes.home2}>Home</div>
      <div className={classes.about}>About</div>
      <div className={classes.product2}>Product</div>
      <div className={classes.blog}>Blog</div>
      <div className={classes.testimonials}>Testimonials</div>
      <div className={classes.ourService}>Our Service</div>
      <div className={classes.contactUs2}>Contact Us</div>
      <div className={classes.benefit}>Benefit</div>
      <div className={classes.about2}>About</div>
      <div className={classes.agroGen2}>AgroGen</div>
      <div className={classes.harvestToHands}>Harvest to Hands</div>
      <div className={classes.icon6}>
        <AgrivistaFarmsLandingPageIcon className={classes.icon7} />
      </div>
      <div className={classes.rectangle93} ></div>
      <div className={classes.schemes}>Schemes</div>
      <div className={classes.getToKnowAboutTheLatestSchemes}>
        Get to know about the latest schemes that are released for the welfare of farmers and the advancement of
        agriculture.
      </div>
      <div className={classes.group145}>
        <Group145Icon className={classes.icon8} />
      </div>
      <div className={classes.group143}>
        <Group143Icon className={classes.icon9} />
      </div>
      <div className={classes.liEuropanLinguesEsMembresDelSa}>
        Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport
        etc, litot Europa usa li sam vocabular.{' '}
      </div>
      <div className={classes.madelineWilliamson}>KISSAN welfare scheme</div>
      <div className={classes.forwardCreativeManager}>Prime Minister Narendra Modi</div>
      <Star_rate2 />
      <Star_rate2 className={classes.star_rate} />
      <Star_rate2 className={classes.star_rate2} />
      <Star_rate2 className={classes.star_rate3} />
      <Star_rate2 className={classes.star_rate4} />
      <div className={classes.rectangle31} style={{backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhqn8fFsW1g4-TeYngs4VbbiGyCQW3NGiWYg&usqp=CAU")'}}></div>
      <div className={classes.ourService2}>Our service</div>
      <div className={classes.rectangle125}></div>
      <div className={classes.harvestToHands2}>Harvest to Hands</div>
      <div className={classes.group}>
        <GroupIcon className={classes.icon10} />
      </div>
      <div className={classes.rectangle132}></div>
      <div className={classes.establishConnections}>Establish Connections</div>
      <div className={classes.icon11}>
        <AgrivistaFarmsLandingPageIcon2 className={classes.icon12} />
      </div>
      <div className={classes.rectangle112}></div>
      <div className={classes.priceTransparency}>Price transparency</div>
      <div className={classes.group2}>
        <GroupIcon2 className={classes.icon13} />
      </div>
      <div className={classes.rectangle108}></div>
      <div className={classes.supportFarmers}>Support Farmers</div>
      <div className={classes.image10}>
        <GroupIcon className={classes.icon10} />
      </div>
      <div className={classes.image5}></div>
      {/* <div className={classes.rectangle32}></div> */}
      {/* <div className={classes.rectangle33}></div> */}
      {/* <div className={classes.rectangle34}></div> */}
      {/* <div className={classes.hiHowCanHelpYou}> Hi 👋🏽 how can help you 👀</div> */}
      <div className={classes.image6}></div> 
      <div className={classes.image7}></div>
      <div className={classes.image8}></div>
      <div className={classes.rectangle36}></div>
      <div className={classes.image9}></div>
      <div className={classes.aboutUs2}>About Us</div>
      <div className={classes.rectangle37} style={{backgroundImage: 'url("https://img.freepik.com/free-photo/high-angle-avocados-tomatoes-peppers-tray_23-2148685402.jpg")'}}></div>
      <div className={classes.rectangle38}></div>
      <div className={classes.rectangle39}></div>
      <div className={classes.ourAim}>Our Aim</div>
      <div className={classes.weAimToRevolutionizeAgricultur}>
        We aim to revolutionize agriculture, enabling farmers to swiftly sell tomatoes by registering on our platform or
        through local agents. They can fix prices, and upon delivery, our agents promptly pay from sponsor funds,
        creating a seamless process benefiting farmers, sponsors, and buyers with efficient, transparent transactions
        and improved market access.
      </div>
      <div className={classes.areYouAFarmerOrPerhapsAVendorE}>
        Are you a farmer, or perhaps a vendor? else if you are looking for a work, maybe part-time or full-time? Connect
        with us!
      </div>
      <div className={classes.whoAreYou}>Who are you?</div>
      
      <div className={classes.image21}></div>
    </div>
    </div>
  );
});

export default AgriVistaFarmsLandingPage;

// start
// import { memo, useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const NAV_LINKS = [
//   { label: 'About',    href: '#about'    },
//   { label: 'Why Us',   href: '#why'      },
//   { label: 'Products', href: '#products' },
//   { label: 'Services', href: '#services' },
//   { label: 'Blog',     href: '#blog'     },
//   { label: 'Schemes',  href: '#schemes'  },
// ];

// const HERO_METRICS = [
//   { val: '10K+',   label: 'Farmers Onboarded'         },
//   { val: '500+',   label: 'Districts Covered'          },
//   { val: '₹120Cr+', label: 'Transactions Facilitated'  },
// ];

// const MARQUEE_ITEMS = [
//   { icon: '🌱', text: 'Direct Farm-to-Market'     },
//   { icon: '💰', text: 'Transparent Pricing'        },
//   { icon: '🚚', text: 'Verified Delivery Partners' },
//   { icon: '📊', text: 'Real-time Market Insights'  },
//   { icon: '🛡️', text: 'Secure Payments'            },
//   { icon: '🌾', text: 'Government Scheme Updates'  },
//   { icon: '🤝', text: 'Farmer-Buyer Network'       },
// ];

// const ABOUT_ITEMS = [
//   {
//     icon: '🌾',
//     title: 'Empowering Farmers',
//     desc: 'Farmers can register, fix their own prices, and receive prompt payments—removing exploitative intermediaries from the equation.',
//   },
//   {
//     icon: '🤝',
//     title: 'Verified Buyer Network',
//     desc: 'Buyers get direct access to farm-fresh produce at transparent prices, with quality assurance built into every order.',
//   },
//   {
//     icon: '💼',
//     title: 'Inclusive Earning Opportunities',
//     desc: 'Part-time and full-time work as local delivery agents—creating rural employment while strengthening the supply chain.',
//   },
// ];

// const WHY_CARDS = [
//   { num: '01', icon: '💳', title: 'Transparent & Faster Payments',   desc: 'Funds from sponsors flow directly to farmers upon delivery confirmation—no delays, no hidden deductions, full visibility.' },
//   { num: '02', icon: '📈', title: 'Real-time Market Insights',       desc: 'Live price feeds, demand forecasting, and trend alerts help farmers and buyers make smarter decisions every day.' },
//   { num: '03', icon: '🛡️', title: 'Safer Earning Options',           desc: 'Verified local agents earn commissions safely—with identity checks, escrow payments, and transparent performance tracking.' },
//   { num: '04', icon: '🌐', title: 'Wide Farmer Network',             desc: 'Access thousands of verified farmers across states—eliminating supply shortfalls and ensuring year-round availability.' },
//   { num: '05', icon: '🤖', title: 'AI Crop Health Helpline',         desc: 'Upload a leaf photo, describe the issue, and receive instant AI-powered diagnosis with treatment and fertilizer guidance.' },
//   { num: '06', icon: '📋', title: 'Government Scheme Updates',       desc: 'Stay informed about KISSAN welfare, PM-KISAN, and other schemes curated specifically for your crop and region.' },
// ];

// const PRODUCTS = [
//   { name: 'Green Beans',  price: '₹273', unit: 'kg', region: 'Maharashtra, Karnataka & Tamil Nadu', origin: 'Maharashtra', img: 'https://5.imimg.com/data5/QM/AG/JI/SELLER-89932137/beans-500x500.jpg' },
//   { name: 'Grape Tomato', price: '₹115', unit: 'kg', region: 'Maharashtra, Karnataka & Tamil Nadu', origin: 'Karnataka',   img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Y9pqCyhsfmU7-yLImvR2ZdCVyc5LsvlkjQ&usqp=CAU' },
//   { name: 'Brinjal',      price: '₹47',  unit: 'kg', region: 'West Bengal, Uttar Pradesh & Karnataka', origin: 'West Bengal', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL4m2V56j5JFwfPtgbFFSimLoHduXCRVLISQ29VIEbfnZ53q4FwNpoecuAKWJUDFDiAG4&usqp=CAU' },
//   { name: 'Okra (Bhindi)', price: '₹129', unit: 'kg', region: 'Chhattisgarh, Bihar, Telangana & Odisha', origin: 'Chhattisgarh', img: 'https://ronmayhewphotography.com/wp-content/uploads/2022/06/A-Bunch-of-Okra-.jpg' },
// ];

// const SERVICES = [
//   { icon: '🌾', color: 'green',  title: 'Harvest to Hands Delivery',  desc: 'Our logistics network ensures produce moves from farm gate to buyer doorstep with real-time tracking, minimal handling, and zero cold-chain breaks.' },
//   { icon: '🤝', color: 'amber',  title: 'Establish Connections',       desc: 'Farmers, buyers, and vendors are matched intelligently based on crop type, location, volume, and quality preference—removing manual searching.' },
//   { icon: '💰', color: 'forest', title: 'Price Transparency Engine',   desc: 'Live mandi prices, historical trends, and AI-driven forecasts give every stakeholder the market intelligence to negotiate with confidence.' },
//   { icon: '🧑‍🌾', color: 'earth', title: 'Support Farmers Program',     desc: 'From crop advisory and helpline access to government scheme navigation and financial literacy—AgroGen is a 360° partner for rural India.' },
// ];

// const BLOG_POSTS = [
//   { cat: 'Analytics',     title: 'The Power of Agricultural Analytics: Precision Insights for Every Farm', excerpt: 'Data-driven decisions are reshaping how Indian farmers plan harvests, manage inputs, and access the best markets for their produce.', date: 'March 2025', img: 'https://www.shutterstock.com/image-photo/farmer-using-tablet-standing-wheat-600nw-1767436760.jpg', featured: true },
//   { cat: 'Planning',      title: 'Cultivate Success: Master Crop Planning for Abundant Harvests',          excerpt: 'A practical guide to seasonal crop rotation, soil health, and demand-aligned planting calendars.',                                date: 'Feb 2025',   img: 'https://img.freepik.com/free-photo/high-angle-avocados-tomatoes-peppers-tray_23-2148685402.jpg' },
//   { cat: 'Sustainability', title: 'Innovations for a Greener Future in Indian Farming',                    excerpt: 'Sustainable practices transforming agriculture—from organic certification to drone-based crop monitoring.',                        date: 'Jan 2025',   img: 'https://t3.ftcdn.net/jpg/01/67/18/20/360_F_167182087_xSJL6Bb1P0GdX3MHTkCafNjbVGmHtE3h.jpg' },
// ];

// const SCHEMES = [
//   { name: 'PM-KISAN Samman Nidhi',   desc: '₹6,000/year direct income support for eligible farmers'   },
//   { name: 'KISSAN Welfare Scheme',   desc: 'Comprehensive welfare and advisory support platform'        },
//   { name: 'Fasal Bima Yojana',       desc: 'Crop insurance against natural calamities and pests'        },
//   { name: 'eNAM Digital Marketplace', desc: 'Online trading portal for agricultural commodities'        },
// ];

// const CTA_CARDS = [
//   { icon: '🧑‍🌾', color: 'a', title: "I'm a Farmer",       sub: 'Register your farm, list produce, receive fast payments'        },
//   { icon: '🛒',   color: 'b', title: "I'm a Buyer / Vendor", sub: 'Access verified farm-fresh produce at transparent prices'        },
//   { icon: '💼',   color: 'c', title: 'I Want to Work',        sub: 'Join as a local delivery agent — part-time or full-time'        },
// ];

// const FOOTER_PAGES   = ['About', 'Products', 'Blog', 'Schemes'];
// const FOOTER_SERVICES = ['Harvest to Hands', 'Establish Connections', 'Price Transparency', 'Support Farmers', 'Crop Helpline'];
// const FOOTER_COMPANY  = ['Our Story', 'Work With Us', 'Testimonials', 'Contact Us', 'Delivery Partner'];

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

// :root {
//   --earth:      #1a1200;
//   --forest:     #0b2e14;
//   --moss:       #1d4a27;
//   --sage:       #2e7d44;
//   --leaf:       #4aab63;
//   --mint:       #8fd4a3;
//   --cream:      #f5f0e8;
//   --parchment:  #ede5d0;
//   --amber:      #c9860a;
//   --amber-lt:   #f5d48e;
//   --text-dark:  #0e1a10;
//   --text-mid:   #3a5240;
//   --text-mute:  #7a9980;
//   --border:     rgba(77,171,99,0.15);
//   --font-display: 'Playfair Display', Georgia, serif;
//   --font-body:    'Outfit', sans-serif;
//   --ease-out: cubic-bezier(0.16,1,0.3,1);
// }
// *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
// html { scroll-behavior: smooth; }
// body { font-family: var(--font-body); background: var(--cream); color: var(--text-dark); overflow-x: hidden; }
// a { color: inherit; text-decoration: none; }
// img { max-width: 100%; display: block; }
// button { font-family: inherit; cursor: pointer; }

// /* ── Utils ── */
// .ag-container { max-width: 1160px; margin: 0 auto; padding: 0 40px; }
// .ag-tag {
//   display: inline-flex; align-items: center; gap: 6px;
//   font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
//   padding: 5px 14px; border-radius: 20px;
//   background: rgba(78,171,99,0.12); color: var(--sage); border: 1px solid rgba(78,171,99,0.25);
// }
// .ag-tag::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--leaf); }
// .ag-tag-dark { background: rgba(74,171,99,0.08); color: var(--mint); border-color: rgba(74,171,99,0.2); }
// .ag-eyebrow { margin-bottom: 16px; }
// .ag-title { font-family: var(--font-display); font-size: clamp(32px,4vw,52px); line-height: 1.12; letter-spacing: -0.02em; color: var(--text-dark); }
// .ag-title em { font-style: italic; color: var(--sage); }
// .ag-title-light { color: #fff; }
// .ag-sub { font-size: 16px; font-weight: 300; color: var(--text-mute); line-height: 1.7; max-width: 520px; margin-top: 14px; }
// .ag-sub-dark { color: rgba(200,240,216,0.55); }
// .ag-divider { width: 48px; height: 3px; background: var(--leaf); border-radius: 4px; margin-top: 16px; }

// /* ── Buttons ── */
// .ag-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: 10px; border: none; font-size: 14px; font-weight: 600; transition: all 0.2s var(--ease-out); }
// .ag-btn-primary { background: var(--moss); color: #fff; box-shadow: 0 4px 16px rgba(11,46,20,.25); }
// .ag-btn-primary:hover { background: var(--sage); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(11,46,20,.32); }
// .ag-btn-outline { background: transparent; color: var(--moss); border: 1.5px solid var(--moss); }
// .ag-btn-outline:hover { background: var(--moss); color: #fff; }
// .ag-btn-ghost { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
// .ag-btn-ghost:hover { background: rgba(255,255,255,0.2); }
// .ag-btn-amber { background: var(--amber); color: #fff; box-shadow: 0 4px 16px rgba(201,134,10,.3); }
// .ag-btn-amber:hover { background: #b5770a; transform: translateY(-2px); }

// /* ── Animations ── */
// @keyframes ag-fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
// @keyframes ag-scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
// @keyframes ag-floatY { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
// @keyframes ag-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
// @keyframes ag-grain {
//   0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
//   30%{transform:translate(3%,2%)} 50%{transform:translate(-1%,4%)}
//   70%{transform:translate(2%,-2%)} 90%{transform:translate(-3%,1%)}
// }
// .ag-fade-up { opacity:0; animation: ag-fadeUp 0.7s var(--ease-out) forwards; }
// .ag-d1{animation-delay:.1s}.ag-d2{animation-delay:.2s}.ag-d3{animation-delay:.3s}
// .ag-d4{animation-delay:.4s}.ag-d5{animation-delay:.5s}.ag-d6{animation-delay:.6s}

// /* ── Nav ── */
// .ag-nav {
//   position: fixed; top:0; left:0; right:0; z-index:1000; height:68px;
//   background: rgba(10,22,12,0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
//   border-bottom: 1px solid rgba(78,171,99,0.1);
//   display: flex; align-items: center;
// }
// .ag-nav-inner { display:flex; align-items:center; justify-content:space-between; width:100%; max-width:1160px; margin:0 auto; padding:0 40px; }
// .ag-nav-logo { display:flex; align-items:center; gap:10px; font-family:var(--font-display); font-size:20px; font-weight:700; color:#fff; }
// .ag-nav-logo-mark { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,var(--leaf),var(--moss)); display:grid; place-items:center; box-shadow:0 2px 10px rgba(74,171,99,.4); font-size:18px; }
// .ag-nav-links { display:flex; align-items:center; gap:6px; list-style:none; }
// .ag-nav-links a { font-size:14px; font-weight:500; color:rgba(255,255,255,0.7); padding:8px 14px; border-radius:8px; transition:color .2s, background .2s; }
// .ag-nav-links a:hover { color:#fff; background:rgba(255,255,255,0.08); }
// .ag-nav-actions { display:flex; align-items:center; gap:10px; }
// .ag-nav-helpline { font-size:11px; color:var(--mint); font-weight:500; border-right:1px solid rgba(255,255,255,0.1); padding-right:16px; margin-right:6px; }
// .ag-btn-nav-login { padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; border:1.5px solid rgba(255,255,255,0.2); color:#fff; background:transparent; transition:all .2s; }
// .ag-btn-nav-login:hover { background:rgba(255,255,255,0.1); }
// .ag-btn-nav-signup { padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; background:var(--leaf); color:var(--forest); border:none; transition:all .2s; }
// .ag-btn-nav-signup:hover { background:var(--mint); transform:translateY(-1px); }

// /* ── Hero ── */
// .ag-hero { position:relative; min-height:100vh; display:flex; align-items:center; overflow:hidden; background:var(--forest); padding-top:68px; }
// .ag-hero-bg { position:absolute; inset:0; background-image:url('https://www.shutterstock.com/image-photo/farmer-using-tablet-standing-wheat-600nw-1767436760.jpg'); background-size:cover; background-position:center; opacity:.22; }
// .ag-hero-bg::after { content:''; position:absolute; inset:0; background:linear-gradient(120deg,rgba(7,30,14,.97) 40%,rgba(11,46,20,.6) 70%,rgba(46,125,68,.25) 100%); }
// .ag-hero-grain { position:absolute; inset:-50%; width:200%; height:200%; opacity:.6; pointer-events:none; animation:ag-grain 6s steps(1) infinite; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); }
// .ag-hero-inner { position:relative; z-index:2; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
// .ag-hero-tag { margin-bottom:28px; }
// .ag-hero-title { font-family:var(--font-display); font-size:clamp(38px,5.5vw,72px); font-weight:900; line-height:1.05; letter-spacing:-0.03em; color:#fff; margin-bottom:24px; }
// .ag-hero-title em { font-style:italic; color:var(--mint); }
// .ag-hero-title .ag-line2 { display:block; color:var(--amber-lt); }
// .ag-hero-desc { font-size:16px; font-weight:300; line-height:1.75; color:rgba(255,255,255,0.6); max-width:440px; margin-bottom:36px; }
// .ag-hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:52px; }
// .ag-hero-metrics { display:flex; gap:36px; }
// .ag-hero-metric-val { font-family:var(--font-display); font-size:28px; color:#fff; }
// .ag-hero-metric-label { font-size:12px; color:rgba(255,255,255,0.4); margin-top:3px; }
// .ag-hero-metric-sep { width:1px; background:rgba(255,255,255,0.1); align-self:stretch; }
// .ag-hero-visual { position:relative; }
// .ag-hero-card-main { border-radius:24px; overflow:hidden; box-shadow:0 24px 64px rgba(0,0,0,.18); aspect-ratio:4/5; max-height:580px; animation:ag-scaleIn 1s var(--ease-out) 0.3s both; }
// .ag-hero-card-main img { width:100%; height:100%; object-fit:cover; }
// .ag-hero-float { position:absolute; bottom:32px; left:-40px; background:rgba(10,22,12,0.9); backdrop-filter:blur(16px); border:1px solid rgba(78,171,99,.2); border-radius:16px; padding:16px 20px; display:flex; align-items:center; gap:12px; box-shadow:0 8px 32px rgba(0,0,0,.12); animation:ag-fadeUp 0.7s var(--ease-out) 0.8s both; }
// .ag-hero-float-icon { width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg,var(--leaf),var(--moss)); display:grid; place-items:center; font-size:20px; flex-shrink:0; }
// .ag-hero-float-label { font-size:11px; color:var(--mint); font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
// .ag-hero-float-val { font-size:18px; color:#fff; font-weight:700; margin-top:2px; }
// .ag-hero-float2 { position:absolute; top:32px; right:-24px; background:var(--amber); border-radius:14px; padding:14px 18px; box-shadow:0 8px 24px rgba(201,134,10,.35); animation:ag-fadeUp 0.7s var(--ease-out) 1s both; }
// .ag-hero-float2-num { font-family:var(--font-display); font-size:28px; color:#fff; font-weight:700; }
// .ag-hero-float2-label { font-size:11px; color:rgba(255,255,255,.75); font-weight:600; letter-spacing:.04em; margin-top:2px; }

// /* ── Marquee ── */
// .ag-marquee { background:var(--moss); padding:14px 0; overflow:hidden; border-top:1px solid rgba(74,171,99,.15); }
// .ag-marquee-track { display:flex; animation:ag-marquee 22s linear infinite; width:max-content; }
// .ag-marquee-item { display:flex; align-items:center; gap:12px; padding:0 40px; white-space:nowrap; font-size:13px; font-weight:600; letter-spacing:.04em; color:rgba(255,255,255,.7); }
// .ag-marquee-item span { color:var(--mint); font-size:16px; }

// /* ── About ── */
// .ag-about { padding:120px 0; background:var(--cream); }
// .ag-about-inner { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
// .ag-about-visual { position:relative; }
// .ag-about-img-main { border-radius:20px; overflow:hidden; aspect-ratio:4/5; max-height:540px; box-shadow:0 24px 64px rgba(0,0,0,.18); }
// .ag-about-img-main img { width:100%; height:100%; object-fit:cover; }
// .ag-about-img-accent { position:absolute; bottom:-24px; right:-24px; width:48%; aspect-ratio:1; border-radius:16px; overflow:hidden; border:4px solid var(--cream); box-shadow:0 8px 32px rgba(0,0,0,.12); }
// .ag-about-img-accent img { width:100%; height:100%; object-fit:cover; }
// .ag-about-badge { position:absolute; top:32px; left:-24px; background:var(--amber); color:#fff; border-radius:14px; padding:16px 20px; box-shadow:0 8px 24px rgba(201,134,10,.35); text-align:center; }
// .ag-about-badge-num { font-family:var(--font-display); font-size:32px; font-weight:900; }
// .ag-about-badge-label { font-size:10px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; opacity:.85; margin-top:2px; }
// .ag-about-list { display:flex; flex-direction:column; gap:16px; margin-top:32px; }
// .ag-about-item { display:flex; align-items:flex-start; gap:14px; padding:18px; border-radius:12px; background:#fff; border:1px solid rgba(78,171,99,.1); transition:box-shadow .2s, transform .2s; }
// .ag-about-item:hover { box-shadow:0 2px 8px rgba(0,0,0,.08); transform:translateX(4px); }
// .ag-about-icon { width:38px; height:38px; flex-shrink:0; border-radius:9px; background:rgba(74,171,99,.1); display:grid; place-items:center; font-size:18px; }
// .ag-about-item-title { font-size:14px; font-weight:600; color:var(--text-dark); margin-bottom:4px; }
// .ag-about-item-desc { font-size:13px; color:var(--text-mute); line-height:1.55; }
// .ag-about-actions { display:flex; gap:12px; margin-top:36px; }

// /* ── Why ── */
// .ag-why { padding:100px 0; background:var(--forest); position:relative; overflow:hidden; }
// .ag-why::before { content:''; position:absolute; top:-200px; right:-200px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle,rgba(74,171,99,.08) 0%,transparent 70%); pointer-events:none; }
// .ag-why-header { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:end; margin-bottom:64px; }
// .ag-why-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
// .ag-why-card { background:rgba(255,255,255,.04); border:1px solid rgba(74,171,99,.12); border-radius:18px; padding:32px 28px; transition:background .25s, border-color .25s, transform .25s; }
// .ag-why-card:hover { background:rgba(74,171,99,.06); border-color:rgba(74,171,99,.28); transform:translateY(-4px); }
// .ag-why-card-num { font-family:var(--font-display); font-size:40px; font-weight:700; color:rgba(74,171,99,.15); margin-bottom:16px; line-height:1; }
// .ag-why-card-icon { width:52px; height:52px; border-radius:14px; background:rgba(74,171,99,.12); display:grid; place-items:center; font-size:24px; margin-bottom:22px; transition:background .2s; }
// .ag-why-card:hover .ag-why-card-icon { background:rgba(74,171,99,.2); }
// .ag-why-card-title { font-size:17px; font-weight:600; color:#fff; margin-bottom:10px; }
// .ag-why-card-desc { font-size:14px; color:rgba(200,240,216,.5); line-height:1.65; }

// /* ── Products ── */
// .ag-products { padding:100px 0; background:#fff; }
// .ag-products-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:52px; }
// .ag-products-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
// .ag-product-card { border-radius:16px; overflow:hidden; border:1px solid rgba(78,171,99,.1); background:var(--cream); transition:box-shadow .25s, transform .25s; }
// .ag-product-card:hover { box-shadow:0 8px 32px rgba(0,0,0,.12); transform:translateY(-6px); }
// .ag-product-img { aspect-ratio:1; overflow:hidden; position:relative; }
// .ag-product-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s var(--ease-out); }
// .ag-product-card:hover .ag-product-img img { transform:scale(1.07); }
// .ag-product-origin { position:absolute; top:12px; left:12px; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; background:rgba(0,0,0,.55); color:#fff; padding:4px 10px; border-radius:20px; backdrop-filter:blur(4px); }
// .ag-product-info { padding:18px; }
// .ag-product-name { font-size:16px; font-weight:700; color:var(--text-dark); margin-bottom:4px; }
// .ag-product-region { font-size:12px; color:var(--text-mute); margin-bottom:12px; line-height:1.4; }
// .ag-product-footer { display:flex; align-items:center; justify-content:space-between; }
// .ag-product-price { font-family:var(--font-display); font-size:20px; color:var(--sage); font-weight:700; }
// .ag-product-price sub { font-size:12px; font-family:var(--font-body); font-weight:400; color:var(--text-mute); }
// .ag-product-btn { width:34px; height:34px; border-radius:8px; border:none; background:var(--moss); color:#fff; font-size:18px; display:grid; place-items:center; transition:background .2s, transform .2s; }
// .ag-product-btn:hover { background:var(--sage); transform:scale(1.08); }

// /* ── Services ── */
// .ag-services { padding:100px 0; background:var(--parchment); }
// .ag-services-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:52px; }
// .ag-service-card { background:#fff; border-radius:18px; padding:36px; border:1px solid rgba(78,171,99,.1); display:grid; grid-template-columns:auto 1fr; gap:24px; transition:box-shadow .25s, transform .2s; }
// .ag-service-card:hover { box-shadow:0 8px 32px rgba(0,0,0,.12); transform:translateY(-3px); }
// .ag-service-icon { width:60px; height:60px; flex-shrink:0; border-radius:16px; display:grid; place-items:center; font-size:28px; }
// .ag-service-icon.green  { background:rgba(74,171,99,.1); }
// .ag-service-icon.amber  { background:rgba(201,134,10,.1); }
// .ag-service-icon.forest { background:rgba(11,46,20,.08); }
// .ag-service-icon.earth  { background:rgba(201,134,10,.08); }
// .ag-service-title { font-size:18px; font-weight:700; color:var(--text-dark); margin-bottom:8px; }
// .ag-service-desc { font-size:14px; color:var(--text-mute); line-height:1.65; }
// .ag-service-link { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:var(--sage); margin-top:14px; transition:gap .2s; }
// .ag-service-link:hover { gap:10px; }

// /* ── Blog ── */
// .ag-blog { padding:100px 0; background:#fff; }
// .ag-blog-grid { display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:24px; margin-top:52px; }
// .ag-blog-card { border-radius:16px; overflow:hidden; border:1px solid rgba(78,171,99,.1); transition:box-shadow .25s, transform .25s; }
// .ag-blog-card:hover { box-shadow:0 8px 32px rgba(0,0,0,.12); transform:translateY(-4px); }
// .ag-blog-img { aspect-ratio:16/10; overflow:hidden; }
// .ag-blog-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s var(--ease-out); }
// .ag-blog-card:hover .ag-blog-img img { transform:scale(1.06); }
// .ag-blog-info { padding:22px; background:var(--cream); }
// .ag-blog-cat { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--sage); margin-bottom:8px; }
// .ag-blog-title { font-size:16px; font-weight:700; color:var(--text-dark); line-height:1.4; margin-bottom:8px; }
// .ag-blog-card:first-child .ag-blog-title { font-size:20px; }
// .ag-blog-excerpt { font-size:13px; color:var(--text-mute); line-height:1.6; }
// .ag-blog-footer { display:flex; align-items:center; justify-content:space-between; margin-top:16px; padding-top:16px; border-top:1px solid rgba(78,171,99,.1); }
// .ag-blog-date { font-size:12px; color:var(--text-mute); }
// .ag-blog-read { font-size:12px; font-weight:600; color:var(--sage); }

// /* ── Schemes ── */
// .ag-schemes { padding:100px 0; background:var(--forest); position:relative; overflow:hidden; }
// .ag-schemes::after { content:''; position:absolute; bottom:-120px; left:-120px; width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(74,171,99,.07) 0%,transparent 70%); pointer-events:none; }
// .ag-schemes-inner { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
// .ag-schemes-list { display:flex; flex-direction:column; gap:12px; margin-top:32px; }
// .ag-scheme-item { display:flex; align-items:center; gap:12px; padding:14px 18px; border-radius:12px; background:rgba(255,255,255,.04); border:1px solid rgba(74,171,99,.12); transition:background .2s, border-color .2s; }
// .ag-scheme-item:hover { background:rgba(74,171,99,.08); border-color:rgba(74,171,99,.25); }
// .ag-scheme-dot { width:8px; height:8px; border-radius:50%; background:var(--leaf); flex-shrink:0; }
// .ag-scheme-name { font-size:14px; font-weight:600; color:rgba(255,255,255,.85); }
// .ag-scheme-desc { font-size:12px; color:rgba(200,240,216,.45); margin-top:1px; }
// .ag-testimonial { background:rgba(255,255,255,.05); border:1px solid rgba(74,171,99,.15); border-radius:20px; padding:36px; }
// .ag-testimonial-stars { display:flex; gap:3px; color:var(--amber); font-size:18px; margin-bottom:20px; }
// .ag-testimonial-quote { font-family:var(--font-display); font-size:18px; font-style:italic; color:rgba(255,255,255,.8); line-height:1.6; margin-bottom:24px; }
// .ag-testimonial-author { display:flex; align-items:center; gap:14px; }
// .ag-testimonial-avatar { width:48px; height:48px; border-radius:50%; overflow:hidden; border:2px solid rgba(74,171,99,.3); }
// .ag-testimonial-avatar img { width:100%; height:100%; object-fit:cover; }
// .ag-testimonial-name { font-size:15px; font-weight:700; color:#fff; }
// .ag-testimonial-role { font-size:12px; color:var(--mint); margin-top:2px; }

// /* ── CTA ── */
// .ag-cta { padding:100px 0; background:var(--cream); }
// .ag-cta-inner { background:linear-gradient(135deg,var(--moss),var(--earth)); border-radius:28px; padding:72px 80px; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; position:relative; overflow:hidden; }
// .ag-cta-inner::before { content:''; position:absolute; top:-120px; right:-80px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle,rgba(74,171,99,.12) 0%,transparent 70%); }
// .ag-cta-title { font-family:var(--font-display); font-size:clamp(28px,3.5vw,42px); color:#fff; line-height:1.15; }
// .ag-cta-title em { font-style:italic; color:var(--mint); }
// .ag-cta-sub { font-size:15px; color:rgba(255,255,255,.55); margin-top:14px; line-height:1.7; }
// .ag-cta-cards { display:flex; flex-direction:column; gap:14px; }
// .ag-cta-card { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:20px 24px; display:flex; align-items:center; gap:16px; cursor:pointer; transition:background .2s, transform .2s; }
// .ag-cta-card:hover { background:rgba(255,255,255,.12); transform:translateX(4px); }
// .ag-cta-icon { width:44px; height:44px; border-radius:11px; display:grid; place-items:center; font-size:22px; flex-shrink:0; }
// .ag-cta-icon.a { background:rgba(74,171,99,.2); }
// .ag-cta-icon.b { background:rgba(201,134,10,.2); }
// .ag-cta-icon.c { background:rgba(255,255,255,.1); }
// .ag-cta-card-title { font-size:14px; font-weight:700; color:#fff; }
// .ag-cta-card-sub { font-size:12px; color:rgba(255,255,255,.45); margin-top:2px; }
// .ag-cta-card-arrow { margin-left:auto; color:rgba(255,255,255,.3); font-size:18px; }

// /* ── Footer ── */
// .ag-footer { background:var(--earth); padding:72px 0 28px; }
// .ag-footer-grid { display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr; gap:48px; margin-bottom:56px; }
// .ag-footer-brand-logo { display:flex; align-items:center; gap:10px; margin-bottom:16px; font-family:var(--font-display); font-size:22px; color:#fff; }
// .ag-footer-logo-mark { width:36px; height:36px; border-radius:9px; background:linear-gradient(135deg,var(--leaf),var(--moss)); display:grid; place-items:center; font-size:19px; }
// .ag-footer-tagline { font-size:14px; color:rgba(255,255,255,.38); line-height:1.65; max-width:240px; margin-bottom:24px; }
// .ag-footer-helpline { display:inline-flex; align-items:center; gap:8px; font-size:12px; color:var(--mint); font-weight:500; background:rgba(74,171,99,.1); border:1px solid rgba(74,171,99,.2); padding:8px 14px; border-radius:8px; }
// .ag-footer-col-title { font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-bottom:18px; }
// .ag-footer-links { display:flex; flex-direction:column; gap:10px; list-style:none; }
// .ag-footer-links a { font-size:14px; color:rgba(255,255,255,.5); transition:color .2s; }
// .ag-footer-links a:hover { color:var(--mint); }
// .ag-footer-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:24px; border-top:1px solid rgba(255,255,255,.06); }
// .ag-footer-copy { font-size:12px; color:rgba(255,255,255,.25); }
// .ag-footer-legal { display:flex; gap:20px; }
// .ag-footer-legal a { font-size:12px; color:rgba(255,255,255,.25); transition:color .2s; }
// .ag-footer-legal a:hover { color:var(--mint); }

// /* ── Responsive ── */
// @media (max-width:1024px) {
//   .ag-hero-inner,.ag-about-inner,.ag-schemes-inner,.ag-cta-inner { grid-template-columns:1fr; gap:48px; }
//   .ag-hero-visual,.ag-about-visual { display:none; }
//   .ag-why-grid { grid-template-columns:1fr 1fr; }
//   .ag-products-grid { grid-template-columns:1fr 1fr; }
//   .ag-blog-grid { grid-template-columns:1fr 1fr; }
//   .ag-footer-grid { grid-template-columns:1fr 1fr; }
//   .ag-cta-inner { padding:48px 40px; }
// }
// @media (max-width:700px) {
//   .ag-container { padding:0 20px; }
//   .ag-nav-links,.ag-nav-helpline { display:none; }
//   .ag-why-grid,.ag-services-grid,.ag-blog-grid { grid-template-columns:1fr; }
//   .ag-products-grid { grid-template-columns:1fr 1fr; }
//   .ag-footer-grid { grid-template-columns:1fr; }
//   .ag-why-header,.ag-products-header { grid-template-columns:1fr; }
//   .ag-hero-metrics { gap:20px; }
// }
// `;

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const Tag = ({ children, dark = false }) => (
//   <span className={`ag-tag${dark ? ' ag-tag-dark' : ''}`}>{children}</span>
// );

// const NavBar = () => (
//   <nav className="ag-nav">
//     <div className="ag-nav-inner">
//       <div className="ag-nav-logo">
//         <div className="ag-nav-logo-mark">🌿</div>
//         AgroGen
//       </div>
//       <ul className="ag-nav-links">
//         {NAV_LINKS.map(({ label, href }) => (
//           <li key={label}><a href={href}>{label}</a></li>
//         ))}
//       </ul>
//       <div className="ag-nav-actions">
//         <span className="ag-nav-helpline">📞 155261 / 011-24300606</span>
//         <Link to="/chooser"><button className="ag-btn-nav-login">Login</button></Link>
//         <Link to="/chooser"><button className="ag-btn-nav-signup">Sign Up</button></Link>
//       </div>
//     </div>
//   </nav>
// );

// const HeroSection = () => {
//   const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
//   return (
//     <section className="ag-hero">
//       <div className="ag-hero-bg" />
//       <div className="ag-hero-grain" />
//       <div className="ag-container">
//         <div className="ag-hero-inner">
//           <div className="ag-hero-content">
//             <div className="ag-hero-tag ag-fade-up ag-d1">
//               <Tag>🌾 Harvest to Hands Platform</Tag>
//             </div>
//             <h1 className="ag-hero-title ag-fade-up ag-d2">
//               Transforming <em>Indian Agriculture</em>
//               <span className="ag-line2">with Technology</span>
//             </h1>
//             <p className="ag-hero-desc ag-fade-up ag-d3">
//               At AgroGen, we connect hardworking farmers directly with careful buyers and vendors—ensuring transparent,
//               honest transactions and fair prices every time.
//             </p>
//             <div className="ag-hero-actions ag-fade-up ag-d4">
//               <button className="ag-btn ag-btn-primary" onClick={() => scrollTo('why')}>
//                 Get Started
//                 <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
//                   <path d="M3 8h10M9 4l4 4-4 4" />
//                 </svg>
//               </button>
//               <button className="ag-btn ag-btn-ghost" onClick={() => scrollTo('about')}>Learn More</button>
//             </div>
//             <div className="ag-hero-metrics ag-fade-up ag-d5">
//               {HERO_METRICS.map((m, i) => (
//                 <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
//                   {i > 0 && <div className="ag-hero-metric-sep" />}
//                   <div>
//                     <div className="ag-hero-metric-val">{m.val}</div>
//                     <div className="ag-hero-metric-label">{m.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="ag-hero-visual">
//             <div className="ag-hero-card-main">
//               <img src="https://www.shutterstock.com/image-photo/farmer-using-tablet-standing-wheat-600nw-1767436760.jpg" alt="Farmer with technology" />
//             </div>
//             <div className="ag-hero-float">
//               <div className="ag-hero-float-icon">📦</div>
//               <div>
//                 <div className="ag-hero-float-label">Live Market Price</div>
//                 <div className="ag-hero-float-val">Tomato · ₹38/kg</div>
//               </div>
//             </div>
//             <div className="ag-hero-float2">
//               <div className="ag-hero-float2-num">94%</div>
//               <div className="ag-hero-float2-label">On-time Delivery</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// const MarqueeStrip = () => {
//   const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
//   return (
//     <div className="ag-marquee">
//       <div className="ag-marquee-track">
//         {doubled.map((item, i) => (
//           <div className="ag-marquee-item" key={i}>
//             <span>{item.icon}</span>{item.text}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const AboutSection = () => (
//   <section className="ag-about" id="about">
//     <div className="ag-container">
//       <div className="ag-about-inner">
//         <div className="ag-about-visual">
//           <div className="ag-about-img-main">
//             <img src="https://img.freepik.com/free-photo/high-angle-avocados-tomatoes-peppers-tray_23-2148685402.jpg" alt="Fresh produce" />
//           </div>
//           <div className="ag-about-img-accent">
//             <img src="https://t3.ftcdn.net/jpg/01/67/18/20/360_F_167182087_xSJL6Bb1P0GdX3MHTkCafNjbVGmHtE3h.jpg" alt="Fields" />
//           </div>
//           <div className="ag-about-badge">
//             <div className="ag-about-badge-num">5★</div>
//             <div className="ag-about-badge-label">Core Team</div>
//           </div>
//         </div>
//         <div>
//           <div className="ag-eyebrow"><Tag>Our Mission</Tag></div>
//           <h2 className="ag-title">Connecting <em>farmers</em><br />with a smarter market</h2>
//           <div className="ag-divider" />
//           <p className="ag-sub">
//             AgroGen has built a simple, powerful platform connecting hardworking farmers with careful buyers and
//             vendors—fostering transparent, sincere connections in every transaction.
//           </p>
//           <div className="ag-about-list">
//             {ABOUT_ITEMS.map((item) => (
//               <div className="ag-about-item" key={item.title}>
//                 <div className="ag-about-icon">{item.icon}</div>
//                 <div>
//                   <div className="ag-about-item-title">{item.title}</div>
//                   <div className="ag-about-item-desc">{item.desc}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="ag-about-actions">
//             <button className="ag-btn ag-btn-primary">About Us</button>
//             <button className="ag-btn ag-btn-outline">Work With Us</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// const WhySection = () => (
//   <section className="ag-why" id="why">
//     <div className="ag-container">
//       <div className="ag-why-header">
//         <div>
//           <div className="ag-eyebrow"><Tag dark>Why Choose Us</Tag></div>
//           <h2 className="ag-title ag-title-light">The Benefits of <em>Choosing AgroGen</em></h2>
//         </div>
//         <p className="ag-sub ag-sub-dark">
//           Opting for AgroGen guarantees easy access to farmers, real-time market insights, streamlined transactions,
//           and unique earning opportunities unavailable anywhere else.
//         </p>
//       </div>
//       <div className="ag-why-grid">
//         {WHY_CARDS.map((c) => (
//           <div className="ag-why-card" key={c.num}>
//             <div className="ag-why-card-num">{c.num}</div>
//             <div className="ag-why-card-icon">{c.icon}</div>
//             <div className="ag-why-card-title">{c.title}</div>
//             <div className="ag-why-card-desc">{c.desc}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// const ProductsSection = () => {
//   const [cart, setCart] = useState({});
//   const addToCart = (name) => setCart((p) => ({ ...p, [name]: (p[name] || 0) + 1 }));
//   return (
//     <section className="ag-products" id="products">
//       <div className="ag-container">
//         <div className="ag-products-header">
//           <div>
//             <div className="ag-eyebrow"><Tag>Featured Products</Tag></div>
//             <h2 className="ag-title">Our <em>Featured</em> Produce</h2>
//           </div>
//           <button className="ag-btn ag-btn-outline">See All Products</button>
//         </div>
//         <div className="ag-products-grid">
//           {PRODUCTS.map((p) => (
//             <div className="ag-product-card" key={p.name}>
//               <div className="ag-product-img">
//                 <img src={p.img} alt={p.name} />
//                 <div className="ag-product-origin">{p.origin}</div>
//               </div>
//               <div className="ag-product-info">
//                 <div className="ag-product-name">{p.name}</div>
//                 <div className="ag-product-region">{p.region}</div>
//                 <div className="ag-product-footer">
//                   <div className="ag-product-price">{p.price} <sub>/{p.unit}</sub></div>
//                   <button className="ag-product-btn" onClick={() => addToCart(p.name)} title="Add to cart">
//                     {cart[p.name] ? cart[p.name] : '+'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// const ServicesSection = () => (
//   <section className="ag-services" id="services">
//     <div className="ag-container">
//       <div className="ag-eyebrow"><Tag>Our Services</Tag></div>
//       <h2 className="ag-title">Everything you need,<br /><em>all in one platform</em></h2>
//       <div className="ag-divider" />
//       <div className="ag-services-grid">
//         {SERVICES.map((s) => (
//           <div className="ag-service-card" key={s.title}>
//             <div className={`ag-service-icon ${s.color}`}>{s.icon}</div>
//             <div>
//               <div className="ag-service-title">{s.title}</div>
//               <div className="ag-service-desc">{s.desc}</div>
//               <a className="ag-service-link" href="#">Explore Service →</a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// const BlogSection = () => (
//   <section className="ag-blog" id="blog">
//     <div className="ag-container">
//       <div className="ag-eyebrow"><Tag>Our Blog</Tag></div>
//       <h2 className="ag-title">Insights for <em>Modern Agriculture</em></h2>
//       <div className="ag-divider" />
//       <div className="ag-blog-grid">
//         {BLOG_POSTS.map((post) => (
//           <div className="ag-blog-card" key={post.title}>
//             <div className="ag-blog-img"><img src={post.img} alt={post.title} /></div>
//             <div className="ag-blog-info">
//               <div className="ag-blog-cat">{post.cat}</div>
//               <div className="ag-blog-title">{post.title}</div>
//               <div className="ag-blog-excerpt">{post.excerpt}</div>
//               <div className="ag-blog-footer">
//                 <span className="ag-blog-date">{post.date}</span>
//                 <span className="ag-blog-read">Read More →</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// const SchemesSection = () => (
//   <section className="ag-schemes" id="schemes">
//     <div className="ag-container">
//       <div className="ag-schemes-inner">
//         <div>
//           <div className="ag-eyebrow"><Tag dark>Government Schemes</Tag></div>
//           <h2 className="ag-title ag-title-light">Stay informed about <em>welfare schemes</em></h2>
//           <div className="ag-divider" />
//           <p className="ag-sub ag-sub-dark">
//             Get real-time updates on the latest central and state government schemes designed for the welfare of farmers
//             and the advancement of Indian agriculture.
//           </p>
//           <div className="ag-schemes-list">
//             {SCHEMES.map((s) => (
//               <div className="ag-scheme-item" key={s.name}>
//                 <div className="ag-scheme-dot" />
//                 <div>
//                   <div className="ag-scheme-name">{s.name}</div>
//                   <div className="ag-scheme-desc">{s.desc}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="ag-btn ag-btn-primary" style={{ marginTop: 28 }}>View All Schemes</button>
//         </div>

//         <div className="ag-testimonial">
//           <div className="ag-testimonial-stars">{'★'.repeat(5)}</div>
//           <div className="ag-testimonial-quote">
//             "AgroGen completely changed how I sell my harvest. I now get paid within 24 hours of delivery and can see
//             live prices from five different mandis before deciding where to sell."
//           </div>
//           <div className="ag-testimonial-author">
//             <div className="ag-testimonial-avatar">
//               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhqn8fFsW1g4-TeYngs4VbbiGyCQW3NGiWYg&usqp=CAU" alt="Farmer" />
//             </div>
//             <div>
//               <div className="ag-testimonial-name">Ramesh Patil</div>
//               <div className="ag-testimonial-role">Tomato Farmer · Nashik, Maharashtra</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// const CTASection = () => (
//   <section className="ag-cta">
//     <div className="ag-container">
//       <div className="ag-cta-inner">
//         <div>
//           <h2 className="ag-cta-title">Who are you?<br /><em>Connect with AgroGen today.</em></h2>
//           <p className="ag-cta-sub">
//             Whether you're a farmer, vendor, buyer, or looking for part-time work as a local agent—there's a place for
//             you in the AgroGen network.
//           </p>
//           <button className="ag-btn ag-btn-amber" style={{ marginTop: 28 }}>
//             Create Your Account →
//           </button>
//         </div>
//         <div className="ag-cta-cards">
//           {CTA_CARDS.map((c) => (
//             <div className="ag-cta-card" key={c.title}>
//               <div className={`ag-cta-icon ${c.color}`}>{c.icon}</div>
//               <div>
//                 <div className="ag-cta-card-title">{c.title}</div>
//                 <div className="ag-cta-card-sub">{c.sub}</div>
//               </div>
//               <div className="ag-cta-card-arrow">→</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </section>
// );

// const Footer = () => (
//   <footer className="ag-footer">
//     <div className="ag-container">
//       <div className="ag-footer-grid">
//         <div>
//           <div className="ag-footer-brand-logo">
//             <div className="ag-footer-logo-mark">🌿</div>
//             AgroGen
//           </div>
//           <p className="ag-footer-tagline">
//             Harvest to Hands — building a transparent, technology-powered agricultural ecosystem for India.
//           </p>
//           <div className="ag-footer-helpline">📞 Helpline: 155261 / 011-24300606</div>
//         </div>
//         <div>
//           <div className="ag-footer-col-title">Pages</div>
//           <ul className="ag-footer-links">
//             {FOOTER_PAGES.map((p) => <li key={p}><a href="#">{p}</a></li>)}
//           </ul>
//         </div>
//         <div>
//           <div className="ag-footer-col-title">Our Service</div>
//           <ul className="ag-footer-links">
//             {FOOTER_SERVICES.map((s) => <li key={s}><a href="#">{s}</a></li>)}
//           </ul>
//         </div>
//         <div>
//           <div className="ag-footer-col-title">Company</div>
//           <ul className="ag-footer-links">
//             {FOOTER_COMPANY.map((c) => <li key={c}><a href="#">{c}</a></li>)}
//           </ul>
//         </div>
//       </div>
//       <div className="ag-footer-bottom">
//         <span className="ag-footer-copy">© {new Date().getFullYear()} AgroGen. All rights reserved.</span>
//         <div className="ag-footer-legal">
//           <a href="#">Privacy Policy</a>
//           <a href="#">Terms of Service</a>
//           <a href="#">Cookie Policy</a>
//         </div>
//       </div>
//     </div>
//   </footer>
// );

// // ─── Root Component ───────────────────────────────────────────────────────────

// const AgriVistaFarmsLandingPage = memo(function AgriVistaFarmsLandingPage() {
//   return (
//     <>
//       <style>{CSS}</style>
//       <NavBar />
//       <HeroSection />
//       <MarqueeStrip />
//       <AboutSection />
//       <WhySection />
//       <ProductsSection />
//       <ServicesSection />
//       <BlogSection />
//       <SchemesSection />
//       <CTASection />
//       <Footer />
//     </>
//   );
// });

// export default AgriVistaFarmsLandingPage;