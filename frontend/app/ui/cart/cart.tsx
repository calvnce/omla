import React from 'react';
import { CartItem } from '../../lib/defs';
import { setCartCookie, getCartCookie } from '../../lib/cookies';
import { CheckBadgeIcon, MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartComponent: React.FC = () => {
  const [cart, setCart] = React.useState<CartItem[]>(getCartCookie());

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      setCartCookie(newCart);
      return newCart;
    });
  };

  const increaseQuantity = (productId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartCookie(newCart);
      return newCart;
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
        }
        return item;
      });
      setCartCookie(newCart);
      return newCart;
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-4 py-2">
                <img src={item.images[0]?.image} alt={item.name} style={{ width: '50px', height: '50px' }} />
              </td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">
                <button onClick={() => decreaseQuantity(item.id)} className="text-gray-500">
                  <MinusIcon className="h-5 w-5" />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)} className="text-gray-500">
                  <PlusIcon className="h-5 w-5" />
                </button>
              </td>
              <td className="px-4 py-2">${item.price}</td>
              <td className="px-4 py-2">
                <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}></td>
            <td className="px-4 py-2 font-bold">Total:</td>
            <td className="px-4 py-2">${cartTotal.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      {cart.length ==0 && (
        <h2>Empty</h2>
      )}
      {cart.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
        <a href="/checkout" className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <ShoppingBagIcon className="h-5 w-5 mr-2" />
          Proceed to Checkout
          <CheckBadgeIcon className="h-5 w-5 mr-2" />
        </a>
      </div>
      )}
    </div>
  );
};

export default CartComponent;
