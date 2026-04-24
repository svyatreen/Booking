import { Link } from 'wouter';
import { Building2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer links */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              Destinations
            </h3>
            <ul className="mt-5 space-y-3">
              {['Paris', 'Tokyo', 'Bali', 'London'].map((city) => (
                <li key={city}>
                  <Link
                    href={`/hotels?city=${city}`}
                    className="text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/help-center"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-policy"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Safety
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-base text-muted-foreground transition-colors hover:text-primary"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t py-8 sm:flex-row sm:justify-between">
          {/* Left — copyright */}
          <p className="text-base text-muted-foreground order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Selora. All rights reserved.
          </p>

          {/* Center — logo */}
          <Link href="/" className="flex items-center gap-2 order-1 sm:order-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-bold text-primary">
              Selora
            </span>
          </Link>

          {/* Right — social icons */}
          <div className="flex items-center gap-5 order-3">
            <a
              href="#"
              aria-label="Facebook"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <FaFacebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <FaTelegram className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="X (Twitter)"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <FaXTwitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
