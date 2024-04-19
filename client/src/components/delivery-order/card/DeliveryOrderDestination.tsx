import { MapPin } from 'lucide-react';

interface DeliveryOrderDestinationProps {
  from: string;
  to: string;
}

export function DeliveryOrderDestination({ from, to }: DeliveryOrderDestinationProps) {
  return (
    <div className="mt-2">
      <div className="mb-1">
        <p>Delivery destination:</p>
      </div>
      <div className="flex items-end gap-2">
        <MapPin size={20} className="min-h-5 min-w-5" />
        <p className="font-medium">{from}</p>
      </div>
      <div className="ml-[9px] h-5 border-l-2 border-dashed border-primary" />
      <div className="flex gap-2">
        <MapPin size={20} className="min-h-5 min-w-5" />
        <p className="font-medium">{to}</p>
      </div>
    </div>
  );
}
