import { stripePromise } from '@/App';
import { Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

export function ProductAuctionPaymentCompletedPage() {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  useEffect(() => {
    stripePromise.then((stripe) => setStripe(stripe));
  }, [stripePromise]);
  const [message, setMessage] = useState<string | null>(null);


  return <div>Перемога</div>;
}
