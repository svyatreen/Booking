import { Link } from "wouter";
import { Building2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main footer links */}
        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Destinations</h3>
            <ul className="mt-4 space-y-3">
              {["Paris", "New York", "Tokyo", "London", "Bali", "Barcelona"].map((city) => (
                <li key={city}>
                  <Link href={`/hotels?city=${city}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {["About Us", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h3>
            <ul className="mt-4 space-y-3">
              {["Help Center", "Contact Us", "Cancellation Policy", "Safety"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t py-6 sm:flex-row sm:justify-between">
          {/* Left — copyright */}
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            &copy; {new Date().getFullYear()} StayLux. All rights reserved.
          </p>

          {/* Center — logo */}
          <Link href="/" className="flex items-center gap-2 order-1 sm:order-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-bold text-primary">StayLux</span>
          </Link>

          {/* Right — social icons */}
          <div className="flex items-center gap-4 order-3">
            <a href="#" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-primary">
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Telegram" className="text-muted-foreground transition-colors hover:text-primary">
              <FaTelegram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="X (Twitter)" className="text-muted-foreground transition-colors hover:text-primary">
              <FaXTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
