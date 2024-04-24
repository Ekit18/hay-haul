import { Transport } from '@/lib/types/Transport/Transport.type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { transportTypeToIcon, transportTypeToReadable } from './constants';

interface TransportCardProps {
  transport: Transport;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function TransportCard({ transport, onEditClick, onDeleteClick }: TransportCardProps) {
  const transportIcon = transportTypeToIcon[transport.type];
  const transportLabel = transportTypeToReadable[transport.type];
  return (
    <Card className="flex w-full flex-col justify-between">
      <CardHeader>
        <CardTitle>{transport.name}</CardTitle>
        <CardDescription>{transport.licensePlate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <p>Type: </p>
          <p className="flex items-center gap-1 rounded-md border border-black p-1 text-sm">
            <transportIcon.icon size={16} />
            {transportLabel}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onDeleteClick} type="button" variant="destructive" className="gap-2">
          <Trash2 size={20} /> Delete
        </Button>
        <Button onClick={onEditClick} type="button">
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
