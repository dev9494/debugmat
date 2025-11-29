import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Get this from your Stripe Dashboard -> Developers -> API Keys
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const redirectToCheckout = async (priceId: string) => {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    // In a real app, you would call your backend to create a Checkout Session
    // const response = await fetch('/api/create-checkout-session', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ priceId }),
    // });
    // const session = await response.json();
    // const result = await stripe.redirectToCheckout({
    //     sessionId: session.id,
    // });

    // For now, we'll just log it since we don't have a backend set up yet
    console.log('Redirecting to checkout for price:', priceId);
    alert('Stripe integration requires a backend. See STRIPE_SETUP_GUIDE.md');
};

export default stripePromise;
