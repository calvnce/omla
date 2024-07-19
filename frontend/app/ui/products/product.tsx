// components/ProductCard.js
import { CartItem, Product } from '@/app/lib/defs';
import React from 'react';

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  cartItem?: CartItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, increaseQuantity, decreaseQuantity, cartItem }) => {
  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg">
      {/* Main Product Image */}
      <div
        className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{ backgroundImage: `url(${product.images[0]?.image})` }}
        title={product.name}
      ></div>
      <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            {product.name}
          </p>
          <div className="text-gray-900 font-bold text-xl mb-2">{product.name}</div>
          <p className="text-gray-700 text-base">{product.description}</p>
        </div>
        <div className="flex items-center">
          {/* Sub Images */}
          {product.images.slice(1).map((image, index) => (
            <img key={index} className="w-10 h-10 rounded-full mr-4" src={`${image.image}`} alt={`Sub image ${index + 1}`} />
          ))}
          <div className="text-sm">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add to Cart
            </button>
            {cartItem && (
              <div className="mt-2 flex items-center">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="bg-gray-300 text-black px-2 py-1 rounded-lg"
                >
                  -
                </button>
                <span className="mx-2">{cartItem.quantity}</span>
                <button
                  onClick={() => increaseQuantity(product.id)}
                  className="bg-gray-300 text-black px-2 py-1 rounded-lg"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
