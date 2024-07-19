import Form from '@/app/ui/orders/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const statuses = ['pending','confirmed','completed','cancelled'];
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                { label: 'Orders', href: '/dashboard/orders' },
                {
                    label: 'Edit Order',
                    href: `/dashboard/orders/${id}/edit`,
                    active: true,
                },]}
            />
            <Form order_id={Number(id)} statuses={statuses} />
        </main>
    );
}