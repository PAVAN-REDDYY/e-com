import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="container-content flex flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-clay">404</p>
      <h1 className="text-3xl font-semibold text-ink">We couldn't find that page</h1>
      <p className="max-w-sm text-stone-500">
        The link may be broken or the piece may have sold out. Let's get you back to the good stuff.
      </p>
      <Link to="/shop">
        <Button className="mt-2">Browse the shop</Button>
      </Link>
    </div>
  );
}
