import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-4 font-display text-lg font-semibold">MAISON</h4>
            <p className="text-sm text-muted-foreground">
              Curated essentials for modern living. Quality craftsmanship meets
              timeless design.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products?page=1" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?page=1&badge=New"
                  className="hover:text-foreground"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?page=1&badge=Sale"
                  className="hover:text-foreground"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest">
              Help
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Shipping & Returns</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MAISON. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
