'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect } from 'react';
import { createOrder, State } from '@/app/lib/order-service';
import { BookmarkIcon, CheckBadgeIcon, PhoneIcon, UserIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { CartItem } from '@/app/lib/defs';
import { getCartCookie, removeCartCookie } from '@/app/lib/cookies';

export default function CheckoutForm() {
  const initialState: State = { message: null, errors: {} };
  const [cart, setCart] = React.useState<CartItem[]>(getCartCookie());
  const create = createOrder.bind(null, cart);
  const [state, formAction] = useActionState(create, initialState);
  
  useEffect(() => {
    if (state.message) {
      removeCartCookie();
    }
  }, [state.message]);


  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 w-full">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            First name
          </label>
          <div className="relative mt-2 rounded-md">
          <div className="relative">
              <input
                id="firstname"
                name="firstname"
                type="string"
                placeholder="Enter Firstname"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="firstname-error"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="first-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstname &&
                state.errors.firstname.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Customer Lastname */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Last name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lastname"
                name="lastname"
                type="string"
                placeholder="Enter Lastname"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="lastname-error"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="lastname-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lastname &&
                state.errors.lastname.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Phone number */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Choose a phone number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phone"
                name="phone"
                placeholder="Enter Phone number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phone-error"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="phone-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Provide shipping address
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="address"
                name="address"
                placeholder="Enter Shipping address"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="address-error"
              />
              <BookmarkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="address-error" aria-live="polite" aria-atomic="true">
              {state.errors?.address &&
                state.errors.address.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* Display the message if it exists */}
      {state.message && (
          <div className="mb-4 text-sm text-red-500">
            {state.message}
          </div>
        )}
      <div className="mt-6 flex justify-start gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          <span className="inline-flex items-center bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Place Order
            <CheckBadgeIcon className="h-5 mr-2" />
          </span>
        </Button>
      </div>
    </form>
  );
}
