import { Link } from 'react-router-dom';
import { env } from '@/config/env';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/types/product';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-50">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-display font-semibold text-ink">
            {env.store.name.toLowerCase()}<span className="text-clay">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-stone-500">
            Considered apparel, made to last. Designed for the people who keep things for years.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-500">
            {CATEGORY_ORDER.map((cat) => (
              <li key={cat}>
                <Link to={`/shop?category=${cat}`} className="hover:text-clay">
                  {CATEGORY_LABELS[cat]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Help</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-500">
            <li>
              <a href={`mailto:${env.store.supportEmail}`} className="hover:text-clay">
                Contact us
              </a>
            </li>
            <li>Shipping &amp; returns</li>
            <li>Size guide</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Gifting</h3>
          <p className="mt-4 text-sm text-stone-500">
            Send any order straight to someone you love — add a message at checkout and we'll keep
            the prices off the slip.
          </p>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-6 text-xs text-stone-400 sm:flex-row">
          <p>© {year} {env.store.name}. All rights reserved.</p>
          <p>{env.store.supportEmail}</p>
        </div>
      </div>
    </footer>
  );
}
