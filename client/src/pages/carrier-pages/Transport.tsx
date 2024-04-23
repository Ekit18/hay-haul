import { CreateTransportModal } from '@/components/transport/modals/create-transport/CreateTransportModal';
import { cn } from '@/lib/utils';

export function Transport() {
  return (
    <div className="h-full bg-gray-100 pb-4">
      <div className="bg-white p-4 pt-10">
        <h2 className="mb-9 text-3xl font-bold">Transport</h2>
        <CreateTransportModal />
      </div>

      <div
        className={cn(
          'grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 py-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
        )}
      >
        {/* <DeliveryOrderCard key={deliveryOrder.id} deliveryOrder={deliveryOrder} /> */}
      </div>
    </div>
  );
}
