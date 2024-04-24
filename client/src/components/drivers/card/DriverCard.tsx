import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { driverCardStatus } from './DriverCardStatus.enum';

interface DriverCardProps {
  driver: Driver;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function DriverCard({ driver, onDeleteClick, onEditClick }: DriverCardProps) {
  return (
    <Card className="flex w-full flex-col justify-between">
      <CardHeader>
        <CardTitle>{driver.user.fullName}</CardTitle>
        <CardDescription>License id: {driver.licenseId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-2">
          <p>
            Status:{' '}
            <span
              className={cn('w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm', driverCardStatus[driver.status])}
            >
              {driver.status}
            </span>
          </p>
          <p>
            Email: <span>{driver.user.email}</span>
          </p>
          <p>
            Years of experience: <span>{driver.yearsOfExperience}</span>
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
