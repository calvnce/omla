'use client';

import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredOrders } from '@/app/lib/order-service';
import { Order, OrderListResponse } from '@/app/lib/defs';
import OrderStatus from './status';
import Pagination from '../invoices/pagination';
import { DeleteOrder, UpdateOrder } from './buttons';

export default async function OrdersTable({
    artisan_id,
    query,
    currentPage,
}: {
    artisan_id: string | undefined;
    query: string;
    currentPage: number;
}) {
    const fetchedOrders: OrderListResponse = await fetchFilteredOrders(artisan_id, query, currentPage);
    const orders = fetchedOrders.orders;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                    {order.order_lines.map((line)=> (
                        <div>
                        <div className="mb-2 flex items-center">
                        <Image
                            src={line.image}
                            className="mr-2 rounded-full"
                            width={28}
                            height={28}
                            alt={`${line.name}'s profile picture`}
                        />
                        <p>{line.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{line.quantity}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(order.order_total)}</p>
                        <hr/>
                    </div>
                    ))}
                  <OrderStatus status={order.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(order.order_total)}
                    </p>
                    <p>{formatDateToLocal(order.ordered_at)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateOrder id={order.id} />
                    <DeleteOrder id={order.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-white-900 md:table text-sm text-left rtl:text-right text-white-500 dark:text-gray-400">
            <thead className="text-left text-sm text-xs text-white-700 uppercase bg-white-100 dark:text-white-400 rounded-lg">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Items
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders?.map((order) => (
                <tr
                  key={order.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-gray-50 dark:hover:bg-blue-600"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {order.order_lines.map((line)=>(
                        <div className="flex items-center gap-3">
                        <Image
                          src={line.image}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={`${line.name}'s profile picture`}
                        />
                        <p className='text-xs text-gray-700 whitespace-nowrap'>{line.name}</p>
                        <p className='text-xs text-gray-700 uppercase dark:text-gray-400'> | {line.quantity}</p>
                        {/* <hr className='border-b'/> */}
                      </div>
                    ))}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-700 uppercase dark:text-gray-400">
                    {formatCurrency(order.order_total)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-700 uppercase dark:text-gray-400">
                    {formatDateToLocal(order.ordered_at)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateOrder id={order.id} />
                      <DeleteOrder id={order.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination totalPages={fetchedOrders.total} />
    </div>
  );
}
