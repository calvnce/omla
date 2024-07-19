'use client';

import React, { useEffect, useState } from 'react';
import { Product, Cart, CartItem } from '../../lib/defs';
import { fetchProducts } from "@/app/lib/product-service";
import Link from 'next/link';
import { setCartCookie, getCartCookie } from '../../lib/cookies';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(getCartCookie());
  console.log(cart);
  
  useEffect(() => {
    const getProducts = async () => {
      const result = await fetchProducts();
      if (!result.errors) {
        setProducts(result.products);
      } else {
        console.error(result.errors);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    setCartCookie(cart);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const existingItemIndex = newCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex !== -1) {
        newCart[existingItemIndex].quantity += 1;
      } else {
        newCart.push({ ...product, quantity: 1 });
      }
      return newCart;
    });
  };

  return (
    <div className="flex flex-wrap justify-start gap-4">
      {products.map((item) => (
        <div key={item.id} className="w-72 h-96 shadow-lg rounded-lg overflow-hidden flex flex-col">
          <div className="h-48 overflow-hidden">
            <img src={item.images[0]?.image} className="w-full h-full object-cover" alt={item.name} />
          </div>
          <div className="bg-white p-4 flex flex-col flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bookmark" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2" />
                </svg>
              </div>
              <div className="bg-yellow-200 py-1.5 px-6 rounded-full">
                <p className="text-xs text-yellow-500">Featured</p>
              </div>
            </div>
            <div className="mt-4 flex-grow">
              <p className="text-sm text-gray-600 mt-2">{item.name}</p>
            </div>
            <div className="flex items-center justify-between py-4">
              <h3 className="text-blue-500 text-xl font-semibold">${item.price}</h3>
              <button onClick={() => addToCart(item)} className="bg-blue-500 text-white px-4 py-2 rounded">Add to Cart</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
