import { EmptyTagInput } from '@/components/tag-input/EmptyTagInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';

export function FacilityCard({ facilityDetails }: { facilityDetails: FacilityDetails }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{facilityDetails.name}</CardTitle>
        <CardDescription>{facilityDetails.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Code:{facilityDetails.code}</p>
        <EmptyTagInput />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}
