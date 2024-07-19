import Search from '@/app/ui/search';
import Table from '@/app/ui/products/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { CreateProduct } from '@/app/ui/products/buttons';
 
export default async function Page({searchParams,}:{searchParams?: {
    query?: string;
    page?: string;
    }}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const session = await auth();
  return (
    <>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search products..." />
          <CreateProduct />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table artisan_id={session?.user?.id} query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </>
  );
}