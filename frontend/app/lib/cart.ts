// lib/cartUtils.ts
import { Product, Cart, CartItem } from './defs';
import Cookies from 'js-cookie';

const CART_COOKIE_NAME = 'cart';

export const loadCartFromCookies = (): Cart => {
  const cart = Cookies.get(CART_COOKIE_NAME);
  return cart ? JSON.parse(cart) : {};
};

export const saveCartToCookies = (cart: Cart) => {
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), { expires: 7 });
};

export const addToCart = (product: Product, cart: Cart, setCart: React.Dispatch<React.SetStateAction<Cart>>) => {
  setCart((prevCart) => {
    const newCart = { ...prevCart };
    if (newCart[product.id]) {
      newCart[product.id].quantity += 1;
    } else {
      newCart[product.id] = { ...product, quantity: 1 };
    }
    saveCartToCookies(newCart);
    return newCart;
  });
};

export const increaseQuantity = (productId: number, cart: Cart, setCart: React.Dispatch<React.SetStateAction<Cart>>) => {
  setCart((prevCart) => {
    const newCart = { ...prevCart };
    newCart[productId].quantity += 1;
    saveCartToCookies(newCart);
    return newCart;
  });
};

export const decreaseQuantity = (productId: number, cart: Cart, setCart: React.Dispatch<React.SetStateAction<Cart>>) => {
  setCart((prevCart) => {
    const newCart = { ...prevCart };
    if (newCart[productId].quantity > 1) {
      newCart[productId].quantity -= 1;
    } else {
      delete newCart[productId];
    }
    saveCartToCookies(newCart);
    return newCart;
  });
};
