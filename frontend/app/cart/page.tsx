'use client';

import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Search from '../ui/search';
import CartComponent from '../ui/cart/cart';

export default function Page() {  
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-center rounded-lg bg-blue-500 p-4 md:h-32">
        <Link href={'/'}>
          <AcmeLogo />
        </Link>
        <div className="flex items-center ml-auto gap-4">
          <Search placeholder="Search products..." />
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
            As you proceed with your purchase, we want to ensure that you have a clear view of the items in your cart.
              The items listed here represent the contents of your cart, carefully selected by you. 
              This includes the unique products crafted by local artisans that you've chosen to support. 
              <br/>Your satisfaction is our priority, and we want to make sure that your shopping experience is seamless and enjoyable. If you have any questions or need assistance, feel free to reach out to us. 
              Thank you for choosing OMLA for your artisanal shopping experience.
          </p>
        </div>
        <div className="md:w-3/5 md:py-2">
          {/* Add PRODUC Here */}
          <CartComponent />
        </div>
      </div>
    </main>
  );
}
