// utils/cookies.ts
'use client';

import { CartItem } from "./defs";

export const setCartCookie = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('omlcart', JSON.stringify(cart));
  }
};

export const getCartCookie = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('omlcart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};


export const removeCartCookie =() => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('omlcart');
  }
}