
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaUtensils,
  FaMusic,
  FaHeart,
  FaArrowRight,
  FaCheckCircle,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { BiGridVertical } from "react-icons/bi";

import logo from "../assets/logo.png";
import interior from "../assets/interior.png";
import openmic from "../assets/openmic.png";

import "../styles/Odenos.scss";

const heroWords = [
  "Great Food",
  "Good Vibes",
  "Live Music",
  "Great Memories",
  "Odeno's",
];

const features = [
  {
    icon: FaUtensils,
    title: "Great Food",
    description:
      "Enjoy delicious food, carefully prepared and served in a welcoming atmosphere.",
  },
  {
    icon: FaMusic,
    title: "Live Entertainment",
    description:
      "Experience music, special events, and unforgettable evenings with friends.",
  },
  {
    icon: FaHeart,
    title: "Good Vibes",
    description:
      "A comfortable place to relax, connect, and create lasting memories.",
  },
];

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "About Us", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <Reveal className="odenos-section-title">
      <p className="odenos-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="odenos-title-line" />
    </Reveal>
  );
}

export default function OdenosHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [orderPopup, setOrderPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeButtonRef = useRef(null);
  const menuButtonRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((current) => (current + 1) % heroWords.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    if (menuOpen) {
      closeButtonRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (orderPopup) {
      popupRef.current?.focus();
    }
  }, [orderPopup]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }

        if (orderPopup) {
          setOrderPopup(false);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, orderPopup]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const showOrderPopup = () => {
    setMenuOpen(false);
    setOrderPopup(true);
  };

  return (
    <div className="odenos-site">
      <header
        className={`odenos-navbar ${
          scrolled ? "odenos-navbar-scrolled" : ""
        }`}
      >
        <a
          href="#home"
          className="odenos-brand"
          aria-label="Odeno's Home"
          onClick={closeMenu}
        >
          <img src={logo} alt="Odeno's" />
        </a>

        <div className="odenos-navbar-right">
          <button
            type="button"
            className="odenos-nav-order"
            onClick={showOrderPopup}
          >
            Order Online
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            className="odenos-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="odenos-navigation"
            onClick={() => setMenuOpen(true)}
          >
            <BiGridVertical />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="odenos-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
            />

            <motion.nav
              id="odenos-navigation"
              className="odenos-drawer"
              aria-label="Main navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 210,
                damping: 28,
              }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="odenos-close"
                aria-label="Close navigation menu"
                onClick={() => {
                  closeMenu();
                  menuButtonRef.current?.focus();
                }}
              >
                <FaTimes />
              </button>

              <p className="odenos-drawer-eyebrow">
                Discover Odeno's
              </p>

              {navigation.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08 * index,
                  }}
                >
                  {item.label}
                </motion.a>
              ))}

              <button
                type="button"
                className="odenos-drawer-order"
                onClick={showOrderPopup}
              >
                Order Now <FaArrowRight />
              </button>

              <span className="odenos-drawer-bottom">
                Food • Music • Memories
              </span>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <main>
        <section id="home" className="odenos-hero">
          <div className="odenos-hero-glow" />
          <div className="odenos-hero-pattern" />

          <div className="odenos-hero-content">
            <motion.p
              className="odenos-small-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              WELCOME TO ODENO'S
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <span className="odenos-hero-prefix">
                Experience
              </span>

              <span className="odenos-changing-word">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{
                      opacity: 0,
                      y: 35,
                      filter: "blur(8px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -35,
                      filter: "blur(8px)",
                    }}
                    transition={{ duration: 0.55 }}
                  >
                    {heroWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.div
              className="odenos-animated-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            <motion.p
              className="odenos-hero-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              A place where flavour, atmosphere, and
              unforgettable moments come together.
            </motion.p>

            <motion.button
              type="button"
              className="odenos-primary-button"
              onClick={showOrderPopup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              Order Now <FaArrowRight />
            </motion.button>
          </div>

          <a
            className="odenos-scroll-indicator"
            href="#experience"
            aria-label="Scroll to experience section"
          >
            <span>SCROLL TO EXPLORE</span>
            <span className="odenos-scroll-line" />
          </a>
        </section>

        <section
          id="experience"
          className="odenos-features"
        >
          <SectionHeading
            eyebrow="THE ODENO'S EXPERIENCE"
            title="More Than Just Dining"
          />

          <div className="odenos-feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal
                  key={feature.title}
                  className="odenos-feature"
                  delay={index * 0.12}
                >
                  <div className="odenos-feature-icon">
                    <Icon />
                  </div>

                  <h3>{feature.title}</h3>

                  <div className="odenos-feature-line" />

                  <p>{feature.description}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="about" className="odenos-about">
          <Reveal className="odenos-about-image">
            <img
              src={interior}
              alt="Inside Odeno's restaurant"
              loading="lazy"
            />
          </Reveal>

          <Reveal className="odenos-about-content">
            <p className="odenos-eyebrow">
              A LITTLE ABOUT US
            </p>

            <h2>
              A Place to Gather.
              <br />
              A Place to Remember.
            </h2>

            <div className="odenos-short-line" />

            <p>
              At Odeno's, we believe dining is about more
              than just food. It's about the people you
              share it with, the conversations you enjoy,
              and the memories you create.
            </p>

            <p>
              From relaxed evenings to lively gatherings,
              we aim to make every visit feel special.
            </p>

            <a
              href="#events"
              className="odenos-dark-button"
            >
              Explore Our Events <FaArrowRight />
            </a>
          </Reveal>
        </section>

        <section id="events" className="odenos-events">
          <SectionHeading
            eyebrow="MUSIC & ENTERTAINMENT"
            title="Make Every Night Special"
          />

          <div className="odenos-event-content">
            <Reveal className="odenos-event-image">
              <img
                src={openmic}
                alt="Live entertainment at Odeno's"
                loading="lazy"
              />
            </Reveal>

            <Reveal className="odenos-event-text">
              <p className="odenos-eyebrow">
                GOOD TIMES AWAIT
              </p>

              <h3>Food, Music & Great Company</h3>

              <div className="odenos-short-line" />

              <p>
                Enjoy an atmosphere where great food
                meets entertainment. Whether you're
                spending time with friends or looking
                for a memorable evening, Odeno's
                brings people together.
              </p>

              <button
                type="button"
                className="odenos-primary-button"
                onClick={showOrderPopup}
              >
                Order Your Favourites <FaArrowRight />
              </button>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="odenos-contact">
          <Reveal>
            <p className="odenos-eyebrow">
              WE LOOK FORWARD TO SEEING YOU
            </p>

            <h2>Come Experience Odeno's</h2>

            <div className="odenos-short-line" />

            <p>
              Delicious food, welcoming people, and
              moments worth remembering.
            </p>

            <button
              type="button"
              className="odenos-dark-button"
              onClick={showOrderPopup}
            >
              Order Now <FaArrowRight />
            </button>
          </Reveal>
        </section>
      </main>

      <footer className="odenos-footer">
        <img src={logo} alt="Odeno's logo" />

        <p>Good Food. Good Vibes. Great Memories.</p>

        <div className="odenos-footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#events">Events</a>
          <a href="#contact">Contact</a>
        </div>

        <p className="odenos-copyright">
          © {new Date().getFullYear()} Odeno's.
          All rights reserved.
        </p>
      </footer>

      <AnimatePresence>
        {orderPopup && (
          <motion.div
            ref={popupRef}
            className="odenos-order-popup"
            role="dialog"
            aria-modal="false"
            aria-labelledby="odenos-popup-title"
            aria-describedby="odenos-popup-description"
            tabIndex={-1}
            initial={{
              opacity: 0,
              x: 90,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: 90,
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
          >
            <button
              type="button"
              className="odenos-popup-close"
              aria-label="Close order confirmation"
              onClick={() => setOrderPopup(false)}
            >
              <FaTimes />
            </button>

            <div className="odenos-popup-top">
              <div className="odenos-popup-icon">
                <FaCheckCircle />
              </div>

              <div>
                <p className="odenos-popup-label">
                  ODENO'S ONLINE ORDERING
                </p>

                <h3 id="odenos-popup-title">
                  Ready to Order?
                </h3>
              </div>
            </div>

            <p
              id="odenos-popup-description"
              className="odenos-popup-description"
            >
              You're about to visit our online ordering
              page. Would you like to continue?
            </p>

            <div className="odenos-popup-actions">
              <button
                type="button"
                className="odenos-popup-cancel"
                onClick={() => setOrderPopup(false)}
              >
                Cancel
              </button>

              <Link
                to="/"
                className="odenos-popup-confirm"
                onClick={() => setOrderPopup(false)}
              >
                Continue <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
