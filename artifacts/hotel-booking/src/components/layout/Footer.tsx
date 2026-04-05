import { Link } from "wouter";
import { Building2, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold tracking-tight text-primary">StayLux</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A premium hotel booking experience. Discover and book the finest accommodations worldwide with unparalleled service.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Destinations</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/hotels?city=Paris" className="text-sm text-muted-foreground hover:text-primary">
                      Paris
                    </Link>
                  </li>
                  <li>
                    <Link href="/hotels?city=New York" className="text-sm text-muted-foreground hover:text-primary">
                      New York
                    </Link>
                  </li>
                  <li>
                    <Link href="/hotels?city=Tokyo" className="text-sm text-muted-foreground hover:text-primary">
                      Tokyo
                    </Link>
                  </li>
                  <li>
                    <Link href="/hotels?city=London" className="text-sm text-muted-foreground hover:text-primary">
                      London
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Press
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Support</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Cancellation Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-base text-muted-foreground xl:text-center">
            &copy; {new Date().getFullYear()} StayLux. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
