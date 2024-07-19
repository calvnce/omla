'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { updateOrder } from '@/app/lib/order-service';
import { StarIcon } from '@heroicons/react/20/solid';

export default function EditOrderForm({
  order_id,
  statuses,
}: {
    order_id: number;
    statuses: string[];
}) {
  const initialState = { message: '', errors: {} };
  const updateOrderWithId = updateOrder.bind(null, order_id);
  const [state, formAction] = useActionState(updateOrderWithId, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Choose status
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={statuses[0]}
            >
              <option value="" disabled>
                Select a new Order Status
              </option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <StarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

      </div>
      {/* Display the message if it exists */}
      {state.message && (
          <div className="mb-4 text-sm text-red-500">
            {state.message}
          </div>
        )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/orders"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Order Status</Button>
      </div>
    </form>
  );
}
