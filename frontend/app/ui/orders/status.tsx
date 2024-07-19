import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { CheckIcon, ClockIcon, XCircleIcon, } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OrderStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-blue-500 text-white': status === 'confirmed',
          'bg-green-500 text-white': status === 'completed',
          'bg-red-500 text-white': status === 'cancelled',
        },
      )}
    >
      {status === 'pending' && (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      )}
      {status === 'confirmed' && (
        <>
          Confirmed
          <ExclamationCircleIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'completed' && (
        <>
          Completed
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      )}
      {status === 'cancelled' && (
        <>
          Cancelled
          <XCircleIcon className="ml-1 w-4 text-white" />
        </>
      )}
    </span>
  );
}
