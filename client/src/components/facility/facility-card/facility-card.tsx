import { EmptyTagInput } from '@/components/tag-input/EmptyTagInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { Trash2 } from 'lucide-react';

export type FacilityCardProps = {
  facilityDetails: FacilityDetails;
  onEditClick: () => void;
  onDeleteClick: () => void;
};
export function FacilityCard({ facilityDetails, onDeleteClick, onEditClick }: FacilityCardProps) {
  const user = useAppSelector((state) => state.user.user);

  return (
    <Card className="flex w-full flex-col justify-between">
      <CardHeader>
        <CardTitle>{facilityDetails.name}</CardTitle>
        <CardDescription>{facilityDetails.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Code: {facilityDetails.code}</p>
        {user?.role === UserRole.Farmer && facilityDetails.productTypes && (
          <EmptyTagInput selected={facilityDetails.productTypes} />
        )}
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
