import { EmptyTagInput } from '@/components/tag-input/EmptyTagInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';

export type FacilityCardProps = {
  facilityDetails: FacilityDetails;
  onEditClick: () => void;
  onDeleteClick: () => void;
};
export function FacilityCard({ facilityDetails, onDeleteClick, onEditClick }: FacilityCardProps) {
  return (
    <Card className="w-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{facilityDetails.name}</CardTitle>
        <CardDescription>{facilityDetails.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Code: {facilityDetails.code}</p>
        {facilityDetails.productTypes && <EmptyTagInput selected={facilityDetails.productTypes} />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onDeleteClick} type="button" variant="destructive">
          Delete
        </Button>
        <Button onClick={onEditClick} type="button">
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
