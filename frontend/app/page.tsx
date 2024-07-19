'use client';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import Search from './ui/search';
import { useEffect, useState } from 'react';
import ProductList from './ui/products/products';
import { getCartCookie } from './lib/cookies';
import React from 'react';
import { CartItem } from './lib/defs';
import { BookOpenIcon, PencilSquareIcon } from '@heroicons/react/20/solid';

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
          <p className='text-sm leading-6 dark:text-gray-700'>
            Discover the rich and diverse art scene, where local artisans
            bring their unique talents and cultural heritage to life. From traditional
            crafts to contemporary masterpieces, our platform showcases the best of
            Tunisian artistry. Whether you are looking for intricate pottery, vibrant
            textiles, or stunning paintings, you will find a treasure trove of
            creativity and craftsmanship. Support local artists and explore the
            beauty through their eyes. <br/>
            As an artisan, this is your platform
            to showcase your crafts to the world. Register for an account and get
            started; it is absolutely free! By joining OMLA, you not only get a chance
            to sell your unique creations but also connect with a community of
            like-minded artists and enthusiasts who appreciate and value your work.
            We believe in the power of art to bring people together and celebrate
            cultural diversity. Join us in promoting the rich artistic heritage of Tunisia
            and help us create a vibrant marketplace where creativity thrives.
        </p>
         <div className='flex gap-3'>
         <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Register</span> <PencilSquareIcon className="w-5 md:w-6" />
          </Link>
         </div>
        </div>
        <div className="flex justify-start md:w-3/5 md:py-2">
          {/* Add Product List Here */}
          <ProductList />
        </div>
      </div>
    </main>
  );
}
