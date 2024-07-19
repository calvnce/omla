import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchCustomers, fetchFilteredCustomers, fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page({searchParams,}:{searchParams?: {
    query?: string;
    page?: string;
    }}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const filteredCustomers = await fetchFilteredCustomers(query);
    const totalPages = filteredCustomers.length;
  return (
    <div className="w-full">
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table customers={filteredCustomers} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}