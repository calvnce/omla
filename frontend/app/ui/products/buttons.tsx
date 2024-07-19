import { deleteProduct } from "@/app/lib/product-service";
import { BuildingStorefrontIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export function CreateProduct() {
    return (
      <Link
        href="/dashboard/products/create"
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block"> Create </span>{' '}
        <PlusCircleIcon className="h-5 md:ml-4" />
      </Link>
    );
  }
  
  export function UpdateProduct({ id }: { id: number }) {
    return (
      <Link
        href={`/dashboard/products/${id}/edit`}
        className="rounded-md border p-2 hover:bg-blue-500"
      >
        <PencilIcon className="w-5" />
      </Link>
    );
  }
  
  export function DeleteProduct({ id }: { id: number }) {
    const deleteWithId = deleteProduct.bind(null,id);
  
    return (
      <form action={deleteWithId}>
        <button className="rounded-md border p-2 hover:bg-red-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    );
  }