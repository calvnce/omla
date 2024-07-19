'use client';

import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { ProductListResponse } from '@/app/lib/defs';
import Pagination from '../invoices/pagination';
import { fetchArtisanProducts } from '@/app/lib/product-service';
import { DeleteProduct, UpdateProduct } from './buttons';

export default async function Table({
    artisan_id,
    query,
    currentPage,
}: {
    artisan_id: string | undefined;
    query: string;
    currentPage: number;
}) {
    const fetchedProducts:ProductListResponse =  await fetchArtisanProducts(artisan_id);
    const products = fetchedProducts.products;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                    {product.images.map((image)=> (
                        <div>
                        <div className="mb-2 flex items-center">
                        <Image
                            src={image.image}
                            className="mr-2 rounded-full"
                            width={28}
                            height={28}
                            alt={`${product.name}'s picture`}
                        />
                        </div>
                    </div>
                    ))}
                    <p>{product.name}</p>
                    <p>{product.description}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(product.price)}
                    </p>
                    <p>{formatDateToLocal(product.created_at)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id} />
                    <DeleteProduct id={product.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-white-900 md:table text-sm text-left rtl:text-right text-white-500 dark:text-gray-400 table-fixed">
            <thead className="text-left text-sm text-xs text-white-700 uppercase bg-white-100 dark:text-white-400 rounded-lg">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-gray-50 dark:hover:bg-blue-600"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {product.images.map((line)=>(
                        <div className="flex items-center gap-3">
                        <Image
                          src={line.image}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={`${product.name}'s profile picture`}
                        />
                      </div>
                    ))}
                    {product.name}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700 dark:text-gray-400">
                    {product.category}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700 dark:text-gray-400 leading-6">
                    {product.description}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700 dark:text-gray-400">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id} />
                      <DeleteProduct id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={fetchedProducts.total} />
    </div>
    </div>
  );
}
