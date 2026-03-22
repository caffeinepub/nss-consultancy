import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitEnquiry } from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppContent() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = [
        "home",
        "services",
        "about",
        "process",
        "industries",
        "testimonials",
        "contact",
      ];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScroll = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Why Us", id: "about" },
    { label: "Process", id: "process" },
    { label: "Industries", id: "industries" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="font-body">
      {/* NAVBAR */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/97 shadow-md backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() => smoothScroll("home")}
              className="font-display text-xl font-extrabold text-amber"
            >
              NSS Consultancy
            </button>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  data-ocid="nav.link"
                  onClick={() => smoothScroll(link.id)}
                  className={`text-sm font-bold transition-colors relative after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:bg-amber after:transition-all after:duration-300 ${
                    activeSection === link.id
                      ? scrolled
                        ? "text-amber after:w-full"
                        : "text-amber after:w-full"
                      : scrolled
                        ? "text-gray-800 hover:text-amber after:w-0 hover:after:w-full"
                        : "text-white hover:text-amber after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                data-ocid="nav.primary_button"
                onClick={() => smoothScroll("contact")}
                className="bg-amber text-[oklch(0.18_0.055_253)] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-amber-hover transition-all hover:-translate-y-px"
              >
                Get Free Quote →
              </button>
            </div>
            <button
              type="button"
              className="md:hidden flex flex-col gap-[5px] p-1"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 transition-all ${scrolled ? "bg-gray-800" : "bg-white"}`}
              />
              <span
                className={`block w-6 h-0.5 transition-all ${scrolled ? "bg-gray-800" : "bg-white"}`}
              />
              <span
                className={`block w-6 h-0.5 transition-all ${scrolled ? "bg-gray-800" : "bg-white"}`}
              />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-3 flex flex-col gap-1 shadow-lg">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => smoothScroll(link.id)}
                className="text-left text-gray-800 font-bold py-3 px-3 rounded-lg hover:bg-gray-50 flex justify-between items-center"
              >
                {link.label} <span className="text-gray-400">›</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => smoothScroll("contact")}
              className="mt-2 bg-amber text-[oklch(0.18_0.055_253)] font-bold py-3 px-4 rounded-lg text-center"
            >
              Get Free Quote
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <HeroSection smoothScroll={smoothScroll} />

      {/* SERVICES */}
      <ServicesSection />

      {/* WHY US */}
      <WhyUsSection smoothScroll={smoothScroll} />

      {/* PROCESS */}
      <ProcessSection />

      {/* INDUSTRIES */}
      <IndustriesSection />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* CONTACT */}
      <ContactSection />

      {/* FOOTER */}
      <FooterSection smoothScroll={smoothScroll} />

      <Toaster />
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function useCountUp(target: number, suffix: string, shouldAnimate: boolean) {
  const [display, setDisplay] = useState(`0${suffix}`);
  useEffect(() => {
    if (!shouldAnimate) return;
    const dur = 2000;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - (1 - p) ** 3;
      setDisplay(Math.floor(eased * target) + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [shouldAnimate, target, suffix]);
  return display;
}

function StatItem({
  target,
  suffix,
  label,
}: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);
  const display = useCountUp(target, suffix, animate);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimate(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-3xl font-extrabold text-amber-gradient">
        {display}
      </div>
      <div className="text-xs font-bold text-white/80 mt-1">{label}</div>
    </div>
  );
}

function HeroSection({ smoothScroll }: { smoothScroll: (id: string) => void }) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-navy"
      style={{
        background:
          "radial-gradient(ellipse at 15% 60%, oklch(0.24 0.09 258 / 0.5) 0%, transparent 45%), " +
          "radial-gradient(ellipse at 85% 20%, oklch(0.73 0.155 65 / 0.15) 0%, transparent 40%), " +
          "oklch(0.18 0.055 253)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber pulse-dot" />
          <span className="text-sm font-bold text-white">
            Pan India Inventory Audit Experts
          </span>
        </div>

        {/* H1 */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-[4.25rem] font-extrabold text-white leading-[1.08] mb-6 max-w-3xl">
          Professional{" "}
          <span className="text-amber-gradient">Inventory Audit</span>
          <br />
          &amp; Stock Verification
        </h1>

        {/* Sub */}
        <p className="text-lg text-white/85 font-semibold max-w-xl mb-10 leading-relaxed">
          Expert stock verification and barcode-based inventory audits across
          India.{" "}
          <strong className="text-white">
            Accurate. Reliable. Process Driven.
          </strong>
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-14">
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={() => smoothScroll("contact")}
            className="bg-amber text-[oklch(0.18_0.055_253)] font-extrabold text-base px-8 py-3.5 rounded-lg inline-flex items-center gap-2 hover:bg-amber-hover transition-all hover:-translate-y-0.5 shadow-[0_4px_14px_oklch(0.73_0.155_65/0.35)]"
          >
            Get Free Audit Quote →
          </button>
          <button
            type="button"
            data-ocid="hero.secondary_button"
            onClick={() => smoothScroll("services")}
            className="bg-white/10 text-white font-extrabold text-base px-8 py-3.5 rounded-lg border border-white/30 inline-flex items-center gap-2 hover:bg-white/15 transition-all"
          >
            Our Services
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl p-6 rounded-2xl border border-[#FFFE71]"
          style={{ background: "#FFFE71" }}
        >
          <StatItem target={1000} suffix="+" label="Audits Completed" />
          <StatItem target={98} suffix="%" label="Accuracy Rate" />
          <StatItem target={45} suffix="+" label="Audit Staff" />
          <StatItem target={40} suffix="+" label="Cities Covered" />
        </div>
      </div>
      {/* Scanner Gun - Right Side */}
      <div className="scanner-hero">
        <div className="barcode-wrapper">
          <svg
            aria-hidden="true"
            className="barcode-img"
            viewBox="0 0 200 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="200" height="80" fill="#fff" rx="4" />
            {[
              2, 6, 10, 12, 16, 20, 22, 26, 30, 34, 36, 40, 44, 46, 50, 54, 56,
              60, 64, 68, 70, 74, 78, 82, 86, 88, 92, 96, 98, 102, 106, 110,
              112, 116, 120, 124, 126, 130, 134, 136, 140, 144, 148, 150, 154,
              158, 160, 164, 168, 172, 174, 178, 182, 186, 188, 192, 196,
            ].map((x, i) => (
              <rect
                key={`bar-${x}`}
                x={x}
                y="8"
                width={i % 3 === 0 ? 3 : 2}
                height="56"
                fill="#1a2040"
              />
            ))}
          </svg>
          <div className="laser" />
          <div className="scan-glow" />
        </div>
        <svg
          aria-hidden="true"
          className="scanner-gun"
          viewBox="0 0 120 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="10"
            width="80"
            height="50"
            rx="10"
            fill="#1a2040"
            stroke="#f0a500"
            strokeWidth="2"
          />
          <rect x="30" y="20" width="60" height="30" rx="6" fill="#0f1e4a" />
          <rect
            x="35"
            y="27"
            width="50"
            height="16"
            rx="3"
            fill="#f0a500"
            opacity="0.15"
          />
          <line
            x1="38"
            y1="35"
            x2="82"
            y2="35"
            stroke="#f0a500"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <rect
            x="45"
            y="60"
            width="25"
            height="60"
            rx="8"
            fill="#1a2040"
            stroke="#f0a500"
            strokeWidth="2"
          />
          <rect
            x="50"
            y="110"
            width="30"
            height="14"
            rx="4"
            fill="#0f1e4a"
            stroke="#f0a500"
            strokeWidth="1.5"
          />
          <circle cx="60" cy="35" r="6" fill="#f0a500" opacity="0.3" />
          <circle cx="60" cy="35" r="3" fill="#f0a500" />
        </svg>
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

const services = [
  {
    title: "Retail Store Audit",
    desc: "Comprehensive book vs physical reconciliation for accurate store inventory visibility.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Warehouse Audit",
    desc: "Full inventory and transaction audit at warehouse and CFA locations.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    title: "Fixed Asset Tagging",
    desc: "Barcode tagging and re-verification of all fixed assets for complete traceability.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    title: "Compliance Audit",
    desc: "SOP, cash, and statutory compliance review to keep your operations fully aligned.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Manpower Support",
    desc: "Contracted resources deployed at outlets and warehouses for seamless operations.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-section-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.12em] text-[oklch(0.22_0.09_258)] mb-3">
            What We Do
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[oklch(0.18_0.055_253)] mb-4">
            Our Core Services
          </h2>
          <p className="text-base text-[oklch(0.4_0.04_253)] max-w-xl mx-auto font-semibold">
            Comprehensive inventory management solutions tailored to your
            business needs.
          </p>
        </div>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              data-ocid="services.card"
              className="bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_oklch(0.18_0.055_253/0.12)]"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "oklch(0.18 0.055 253)" }}
              >
                {s.icon}
              </div>
              <h3 className="font-display text-base font-extrabold text-[oklch(0.18_0.055_253)] mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-[oklch(0.42_0.04_253)] leading-relaxed font-semibold">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY US ──────────────────────────────────────────────────────────────────

const checklistItems = [
  "Unbiased third-party verification",
  "Real-time data capture",
  "Detailed discrepancy reports",
  "Dedicated client support",
];

const whyCards = [
  {
    title: "Pan India Service",
    desc: "Nationwide presence with consistent quality across multiple cities & States.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={24}
        height={24}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "In-House Technology",
    desc: "Proprietary software for real-time accurate data capture and reporting.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={24}
        height={24}
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="2" x2="9" y2="4" />
        <line x1="15" y1="2" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="22" />
        <line x1="15" y1="20" x2="15" y2="22" />
        <line x1="20" y1="9" x2="22" y2="9" />
        <line x1="20" y1="14" x2="22" y2="14" />
        <line x1="2" y1="9" x2="4" y2="9" />
        <line x1="2" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
  {
    title: "Expert Auditors",
    desc: "Certified professionals with deep domain experience across multiple industries.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={24}
        height={24}
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Fast Turnaround",
    desc: "Less turnaround time with detailed discrepancy reports delivered promptly.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={24}
        height={24}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

function WhyUsSection({
  smoothScroll,
}: { smoothScroll: (id: string) => void }) {
  return (
    <section
      id="about"
      className="py-20 text-white"
      style={{
        background:
          "radial-gradient(ellipse at 15% 60%, oklch(0.24 0.09 258 / 0.5) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 85% 20%, oklch(0.73 0.155 65 / 0.12) 0%, transparent 40%), " +
          "oklch(0.18 0.055 253)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <span className="text-amber text-xs font-bold uppercase tracking-[0.12em] mb-3 block">
              Why Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight">
              Why Choose{" "}
              <span className="text-amber-gradient">NSS Consultancy?</span>
            </h2>
            <p className="text-white/80 text-base font-semibold leading-relaxed mb-8">
              We combine deep domain expertise with cutting-edge technology to
              deliver inventory audit services that set the standard for
              accuracy and reliability across India.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-semibold text-white/90"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width={20}
                    height={20}
                    className="text-amber flex-shrink-0"
                    stroke="oklch(0.73 0.155 65)"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              data-ocid="about.primary_button"
              onClick={() => smoothScroll("contact")}
              className="bg-amber text-[oklch(0.18_0.055_253)] font-extrabold px-7 py-3.5 rounded-lg inline-flex items-center gap-2 hover:bg-amber-hover transition-all hover:-translate-y-0.5"
            >
              Get Started Today →
            </button>
          </div>
          {/* Right 2×2 cards */}
          <div className="grid grid-cols-2 gap-4">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-5 border transition-all duration-200 hover:border-amber-dim"
                style={{
                  backgroundColor: "oklch(0.20 0.065 248)",
                  borderColor: "oklch(1 0 0 / 0.1)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-amber"
                  style={{ backgroundColor: "oklch(0.73 0.155 65 / 0.15)" }}
                >
                  {card.icon}
                </div>
                <h3 className="font-display text-sm font-extrabold text-white mb-1.5">
                  {card.title}
                </h3>
                <p className="text-xs text-white/75 leading-relaxed font-semibold">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────

const processSteps = [
  {
    num: "01",
    title: "Initial Assessment",
    desc: "Evaluate current inventory management systems and identify audit scope.",
  },
  {
    num: "02",
    title: "Planning",
    desc: "Develop detailed audit strategy and timeline based on business requirements.",
  },
  {
    num: "03",
    title: "Physical Count",
    desc: "Systematic counting and verification of all inventory items using barcode technology.",
  },
  {
    num: "04",
    title: "Data Analysis",
    desc: "Compare physical count with system records and identify discrepancies.",
  },
  {
    num: "05",
    title: "Reporting",
    desc: "Detailed documentation of findings, discrepancies, and actionable recommendations.",
  },
  {
    num: "06",
    title: "Implementation",
    desc: "Execute recommended improvements and establish ongoing monitoring systems.",
  },
];

function ProcessSection() {
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.12em] text-emerald-700 mb-3">
            How We Work
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[oklch(0.18_0.055_253)] mb-4">
            Our Audit Process
          </h2>
          <p className="text-base text-[oklch(0.42_0.04_253)] max-w-xl mx-auto font-semibold">
            A structured, transparent six-step methodology for reliable
            inventory audits.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processSteps.map((step) => (
            <div
              key={step.num}
              data-ocid="process.card"
              className="relative border border-gray-200 rounded-2xl p-6 transition-all duration-200 hover:border-amber-dim hover:shadow-[0_8px_28px_oklch(0_0_0/0.08)] overflow-hidden"
            >
              <span
                className="absolute top-3 right-4 font-display text-[3.5rem] font-black leading-none select-none"
                style={{ color: "oklch(0.18 0.055 253 / 0.04)" }}
              >
                {step.num}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs mb-4"
                style={{ backgroundColor: "oklch(0.18 0.055 253)" }}
              >
                {step.num}
              </div>
              <h3 className="font-display text-base font-extrabold text-[oklch(0.18_0.055_253)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[oklch(0.42_0.04_253)] leading-relaxed font-semibold">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── INDUSTRIES ──────────────────────────────────────────────────────────────

const industries = [
  {
    name: "Apparel",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    name: "Electronics",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    name: "Pharmaceuticals",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    name: "FMCG / Retail",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    name: "Jewelry",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    name: "Manufacturing",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    name: "Warehousing",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    name: "Cosmetics",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={26}
        height={26}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

function IndustriesSection() {
  return (
    <section id="industries" className="py-20 bg-section-green">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.12em] text-emerald-700 mb-3">
            Industries
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[oklch(0.2_0.06_160)] mb-4">
            Industries We Serve
          </h2>
          <p className="text-base text-[oklch(0.38_0.05_155)] max-w-xl mx-auto font-semibold">
            Deep expertise across diverse sectors for specialized inventory
            solutions.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((ind) => (
            <div
              key={ind.name}
              data-ocid="industries.card"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/80 border border-emerald-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_20px_oklch(0_0_0/0.1)]"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.18 0.055 253)" }}
              >
                {ind.icon}
              </div>
              <span className="text-sm font-extrabold text-[oklch(0.2_0.06_155)] text-center">
                {ind.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "NSS Consultancy has been an exceptional partner for our inventory audits. Their accuracy, professionalism, and transparent reporting have helped us significantly reduce shrinkage and improve our inventory control.",
    name: "Abhijit M.",
    role: "SCM Head",
    initials: "AM",
  },
  {
    quote:
      "We appreciate the professionalism of NSS Consultancy. Their trained team, quick execution, and consistently high audit quality across all our locations make them a reliable partner.",
    name: "Adnan V.",
    role: "Operations Head",
    initials: "AV",
  },
  {
    quote:
      "NSS Consultancy has been conducting our audits for the past 8 years. Their detailed audits have helped us maintain accurate inventory and improve our internal controls.",
    name: "Mehul M.",
    role: "Inventory Head",
    initials: "MM",
  },
];

const StarIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={16}
    height={16}
    fill="oklch(0.72 0.14 70)"
    stroke="oklch(0.72 0.14 70)"
    strokeWidth={1}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-section-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.12em] text-amber mb-3">
            Client Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[oklch(0.28_0.06_60)]">
            What Our Clients Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-ocid={`testimonials.item.${i + 1}`}
              className="rounded-2xl p-6 flex flex-col transition-all duration-200 hover:shadow-[0_8px_24px_oklch(0.6_0.1_60/0.15)] border"
              style={{
                backgroundColor: "oklch(0.993 0.008 75)",
                borderColor: "oklch(0.82 0.1 75)",
              }}
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <StarIcon key={j} />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed font-semibold flex-1 mb-5"
                style={{ color: "oklch(0.42 0.06 60)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.62 0.1 65)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    className="text-sm font-extrabold"
                    style={{ color: "oklch(0.28 0.06 60)" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.55 0.08 60)" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });
  const { mutate, isPending, isSuccess } = useSubmitEnquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () =>
        toast.success("Thank you! We'll contact you within 24 hours."),
      onError: () => toast.error("Something went wrong. Please try again."),
    });
  };

  const contactItems = [
    {
      label: "Phone",
      value: "+91 8080562020",
      icon: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          width={18}
          height={18}
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 15.5v1.42" />
        </svg>
      ),
    },
    {
      label: "Email",
      value: "audits@nssconsultancy.co.in",
      icon: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          width={18}
          height={18}
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: "Address",
      value:
        "Hari Om Nagar, C-204, Near Birmole Hospital, Panvel – Navi Mumbai, Maharashtra. Pin: 410206",
      icon: (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          width={18}
          height={18}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  const whyItems = [
    "Get a free inventory audit consultation",
    "Customized quote within 24 hours",
    "Pan India service coverage",
    "Know your benefits",
  ];

  const inputCls =
    "w-full border rounded-lg px-3.5 py-2.5 text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-amber/40 focus:border-amber";
  const labelCls = "text-xs font-bold uppercase tracking-[0.06em] block mb-1.5";

  return (
    <section id="contact" className="py-20 bg-section-warm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.12em] mb-3"
            style={{ color: "oklch(0.52 0.14 40)" }}
          >
            Contact Us
          </span>
          <h2
            className="font-display text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: "oklch(0.26 0.07 40)" }}
          >
            Get a Free Audit Quote
          </h2>
          <p
            className="text-base font-semibold max-w-xl mx-auto"
            style={{ color: "oklch(0.44 0.09 40)" }}
          >
            Reach out today for a customized inventory audit solution for your
            business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left */}
          <div>
            <h3
              className="font-display text-xl font-extrabold mb-6"
              style={{ color: "oklch(0.26 0.07 40)" }}
            >
              Contact Information
            </h3>
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "oklch(0.52 0.14 40)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-[0.1em] mb-0.5"
                    style={{ color: "oklch(0.58 0.1 40)" }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "oklch(0.26 0.07 40)" }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
            <div
              className="rounded-xl p-5 mt-6 border"
              style={{
                backgroundColor: "oklch(0.94 0.02 40)",
                borderColor: "oklch(0.85 0.06 40)",
              }}
            >
              <h4
                className="font-display text-base font-extrabold mb-4"
                style={{ color: "oklch(0.26 0.07 40)" }}
              >
                Why Contact Us?
              </h4>
              <ul className="flex flex-col gap-3">
                {whyItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width={16}
                      height={16}
                      stroke="oklch(0.52 0.14 40)"
                      className="flex-shrink-0"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.38 0.08 40)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right – form */}
          <div>
            <div
              className="rounded-2xl p-7 border shadow-sm"
              style={{
                backgroundColor: "oklch(0.998 0.004 50)",
                borderColor: "oklch(0.85 0.06 40)",
              }}
            >
              <h3
                className="font-display text-xl font-extrabold mb-6"
                style={{ color: "oklch(0.26 0.07 40)" }}
              >
                Send us a message
              </h3>

              {isSuccess ? (
                <div
                  data-ocid="contact.success_state"
                  className="flex items-center gap-3 rounded-lg p-4 mb-4"
                  style={{
                    backgroundColor: "oklch(0.93 0.05 145)",
                    border: "1px solid oklch(0.7 0.1 145)",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.38 0.14 145)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width={18}
                    height={18}
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "oklch(0.3 0.1 145)" }}
                  >
                    Thank you! We&apos;ll contact you within 24 hours.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={labelCls}
                        htmlFor="contact-name"
                        style={{ color: "oklch(0.4 0.08 40)" }}
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        data-ocid="contact.input"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className={inputCls}
                        style={{
                          borderColor: "oklch(0.82 0.06 40)",
                          color: "oklch(0.26 0.07 40)",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className={labelCls}
                        htmlFor="contact-company"
                        style={{ color: "oklch(0.4 0.08 40)" }}
                      >
                        Company Name *
                      </label>
                      <input
                        id="contact-company"
                        data-ocid="contact.input"
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, company: e.target.value }))
                        }
                        className={inputCls}
                        style={{
                          borderColor: "oklch(0.82 0.06 40)",
                          color: "oklch(0.26 0.07 40)",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={labelCls}
                        htmlFor="contact-phone"
                        style={{ color: "oklch(0.4 0.08 40)" }}
                      >
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        data-ocid="contact.input"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className={inputCls}
                        style={{
                          borderColor: "oklch(0.82 0.06 40)",
                          color: "oklch(0.26 0.07 40)",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className={labelCls}
                        htmlFor="contact-email"
                        style={{ color: "oklch(0.4 0.08 40)" }}
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        data-ocid="contact.input"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className={inputCls}
                        style={{
                          borderColor: "oklch(0.82 0.06 40)",
                          color: "oklch(0.26 0.07 40)",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className={labelCls}
                      htmlFor="contact-message"
                      style={{ color: "oklch(0.4 0.08 40)" }}
                    >
                      Message / Requirements
                    </label>
                    <textarea
                      id="contact-message"
                      data-ocid="contact.textarea"
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Describe your inventory audit requirements..."
                      className={`${inputCls} resize-none`}
                      style={{
                        borderColor: "oklch(0.82 0.06 40)",
                        color: "oklch(0.26 0.07 40)",
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                  <button
                    data-ocid="contact.submit_button"
                    type="submit"
                    disabled={isPending}
                    className="w-full font-extrabold text-white py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "oklch(0.42 0.12 40)" }}
                  >
                    {isPending ? (
                      <>
                        <svg
                          aria-hidden="true"
                          className="animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth={2}
                          width={18}
                          height={18}
                        >
                          <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            strokeLinecap="round"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>Submit Enquiry →</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function FooterSection({
  smoothScroll,
}: { smoothScroll: (id: string) => void }) {
  const year = new Date().getFullYear();
  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Why Us", id: "about" },
    { label: "Our Process", id: "process" },
    { label: "Industries", id: "industries" },
    { label: "Contact", id: "contact" },
  ];
  const serviceLinks = [
    "Retail-Store Audit",
    "Warehouse Audit",
    "Fixed Asset Tagging",
    "Compliance Audit",
    "Dispatch/Returns Audit",
    "Manpower Support",
  ];

  return (
    <footer
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, oklch(0.24 0.09 258 / 0.3) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 80% 20%, oklch(0.73 0.155 65 / 0.12) 0%, transparent 40%), " +
          "oklch(0.18 0.055 253)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-14 pb-8">
          {/* Brand */}
          <div>
            <div className="font-display text-xl font-extrabold text-amber mb-3">
              NSS Consultancy
            </div>
            <p className="text-sm text-white/75 leading-relaxed font-semibold mb-5">
              Expert inventory audit and stock verification services across
              India. Accurate, reliable, and Process Driven.
            </p>
            <div className="flex gap-2">
              {["in", "f", "ig"].map((s) => (
                <a
                  key={s}
                  href="https://www.linkedin.com"
                  className="w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center text-white text-xs font-bold hover:border-amber hover:text-amber transition-all"
                  aria-label={
                    s === "in"
                      ? "LinkedIn"
                      : s === "f"
                        ? "Facebook"
                        : "Instagram"
                  }
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    data-ocid="footer.link"
                    onClick={() => smoothScroll(link.id)}
                    className="text-white/75 text-sm font-semibold hover:text-amber transition-colors flex items-center gap-1"
                  >
                    ▸ {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
              Our Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => smoothScroll("services")}
                    className="text-white/75 text-sm font-semibold hover:text-amber transition-colors flex items-center gap-1"
                  >
                    ▸ {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
              Contact Info
            </h4>
            {[
              { icon: "phone", text: "+91 8080562020" },
              { icon: "email", text: "audits@nssconsultancy.co.in" },
              {
                icon: "location",
                text: "Hari Om Nagar, C-204, Near Birmole Hospital, Panvel – Navi Mumbai, Pin: 410206",
              },
              { icon: "globe", text: "Pan India Coverage — 40+ Cities" },
            ].map((item) => (
              <div key={item.icon} className="flex items-start gap-3 mb-4">
                <span className="text-amber flex-shrink-0 mt-0.5">
                  {item.icon === "phone" && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width={16}
                      height={16}
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 15.5v1.42" />
                    </svg>
                  )}
                  {item.icon === "email" && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width={16}
                      height={16}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  )}
                  {item.icon === "location" && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width={16}
                      height={16}
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                  {item.icon === "globe" && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width={16}
                      height={16}
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  )}
                </span>
                <span className="text-white/75 text-sm font-semibold">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-white/70 font-semibold">
            &copy; {year} NSS Consultancy. All rights reserved.
          </p>
          <p className="text-sm text-white/60 font-semibold">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:text-amber-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
