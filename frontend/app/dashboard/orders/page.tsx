import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { CreateOrder } from '@/app/ui/orders/buttons';
import OrdersTable from '@/app/ui/orders/orders';
 
export default async function Page({searchParams,}:{searchParams?: {
    query?: string;
    page?: string;
    }}) {
    const session = await auth();
    const user_id = session?.user?.id;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

  return (
    <>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Orders</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search orders..." />
          <CreateOrder />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <OrdersTable artisan_id={user_id} query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </>
  );
}