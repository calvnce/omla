'use client';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import Search from '../ui/search';
import { useEffect, useState } from 'react';
import ProductList from '../ui/products/products';
import { getCartCookie } from '../lib/cookies';
import React from 'react';
import { CartItem } from '../lib/defs';
import CheckoutForm from '../ui/orders/create-form';
import CartComponent from '../ui/cart/cart';

export default function Page() {  
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cart, setCart] = React.useState<CartItem[]>(getCartCookie());

  useEffect(() => {
    // Fetch the cart item count from your cart state or API
    // This is a placeholder for demonstration purposes
    const fetchCartItemCount = () => {
      // Replace with actual logic to get cart item count
      const count = cart.length; // Example count
      setCartItemCount(count);
    };

    fetchCartItemCount();
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-center rounded-lg bg-blue-500 p-4 md:h-32">
        <Link href={'/'}>
          <AcmeLogo />
        </Link>
        <div className="flex items-center ml-auto gap-4">
          <Search placeholder="Search products..." />
          <Link href={'/cart'}>
            <div className="relative">
              <ShoppingCartIcon className="w-12 h-12 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-orange-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col gap-6 rounded-lg bg-gray-50 px-6 py-5 md:w-2/5 md:px-5">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-2xl md:leading-normal`}
          >
            <strong>Welcome to Online market place for the local artisans (OMLA).</strong> 
          </p>
          <p className='text-sm leading-8'>
            This is your checkout form, where you can finalize your purchase. The address collected here will be used to deliver the items you have selected.
            <br/>At OMLA, we are dedicated to supporting local artisans and providing a platform for their unique creations. By shopping with us, you are directly contributing to the growth and sustainability of these talented individuals and their businesses.
            <br/>If you have any questions or need assistance during the checkout process, our support team is here to help. Simply reach out to us, and we'll be glad to assist you.
            <br/>Thank you for choosing OMLA as your online marketplace for artisanal products. We appreciate your support and look forward to delivering your selected items to your doorstep.
          </p>
        </div>
        <div className="md:w-3/5 md:py-2">
          {/* Add Product List Here */}
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
