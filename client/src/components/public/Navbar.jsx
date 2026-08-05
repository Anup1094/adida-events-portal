import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShieldCheck, User, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.svg";
import { getCurrentUser, logoutCustomer } from "../../services/public/authService";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About Us", href: "#aboutus" },
  { name: "Services", href: "#services" },
  { name: "Events", href: "#events" },
  { name: "Gallery", href: "#gallery" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact Us", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    closeMenu();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-md border-border shadow-[0_2px_20px_rgba(36,21,40,0.06)]"
          : "bg-surface border-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">
        <div className="h-16 lg:h-[68px] flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <img src={logo} alt="Adida Events" className="h-9 lg:h-10 w-auto" />
          </motion.a>

          {/* Desktop Menu */}
{/* Desktop Menu */}
<div className="hidden lg:flex items-center gap-7 font-heading">
  {navItems.map((item) => (
    <a
      key={item.name}
      href={item.href}
      className="group relative flex flex-col items-center text-[14px] font-medium tracking-wide text-ink/80 transition-colors hover:text-wine"
    >
      {item.name}
      <span className="mt-1.5 h-[7px] w-[7px] rotate-45 scale-0 rounded-[1px] bg-gold transition-transform duration-300 group-hover:scale-100" />
    </a>
  ))}
</div>

{/* Right Side Desktop */}
<div className="hidden lg:flex items-center gap-3">

  <a
    href="#contact"
    className="rounded-full bg-wine px-5 py-2.5 text-[14px] font-semibold text-ivory transition-colors duration-300 hover:bg-wine-dark"
  >
    Book an Event
  </a>

  <NavLink
    to="/admin/login"
    aria-label="Admin Login"
    title="Admin Login"
    className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border text-ink/50 transition-colors duration-300 hover:border-wine hover:text-wine"
  >
    <ShieldCheck size={16} />
  </NavLink>

</div>

{/* Mobile Hamburger */}

<button
  onClick={() => setIsOpen(!isOpen)}
  aria-label={isOpen ? "Close menu" : "Open menu"}
  className="lg:hidden text-ink"
>
  {isOpen ? <X size={28} /> : <Menu size={28} />}
</button>

</div>
</div>

{/* Mobile Menu */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-border bg-surface shadow-lg"
          >
            <div className="flex flex-col px-6 py-5">

              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="border-b border-border/70 py-4 text-ink hover:text-wine"
                >
                  {item.name}
                </a>
              ))}

              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-6 rounded-full bg-wine py-3 text-center font-semibold text-ivory"
              >
                Book an Event
              </a>

              <NavLink
                to="/admin/login"
                onClick={closeMenu}
                className="mt-3 flex items-center justify-center gap-2 rounded-full border border-border py-3 text-ink hover:border-wine hover:text-wine"
              >
                <ShieldCheck size={16} />
                Admin Login
              </NavLink>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;