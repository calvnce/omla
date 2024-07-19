import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  TicketIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { getArtisanStats } from '@/app/lib/stats';
import { auth } from '@/auth';
import { formatCurrency } from '@/app/lib/utils';


const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  orders: TruckIcon,
  products:TicketIcon
};

export default async function CardWrapper() {
  const session = await auth();
  const user = session?.user;
  const stats = await getArtisanStats(user?.id);
  return (
    <>
      <Card title="Completed" value={formatCurrency(stats['completed_orders_total']*100 ?? '0')} type="collected" />
      <Card title="Pending" value={formatCurrency(stats['pending_orders_total']*100 ?? '0')} type="pending" />
      <Card title="Total Orders" value={stats['orders_count']} type="orders" />
      <Card
        title="Total Produts"
        value={stats['products_count']}
        type="products"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'orders' | 'customers' | 'pending' | 'collected' | 'products';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
