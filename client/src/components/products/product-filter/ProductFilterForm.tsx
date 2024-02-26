import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';

interface ProductFilterFormProps {}

export function ProductFilterForm({}: ProductFilterFormProps) {
  const farms: FacilityDetails[] = [
    {
      id: '1',
      name: 'Farm 1',
      address: 'Address 1',
      createdAt: '2021-10-01T00:00:00.000Z',
      updatedAt: '2021-10-01T00:00:00.000Z',
      code: 'F1',
      productTypes: [
        {
          id: '1',
          name: 'Product 1',
          facilityDetailsId: '1',
          createdAt: '2021-10-01T00:00:00.000Z',
          updatedAt: '2021-10-01T00:00:00.000Z'
        }
      ]
    },
    {
      id: '2',
      name: 'Farm 2',
      address: 'Address 2',
      createdAt: '2021-10-01T00:00:00.000Z',
      updatedAt: '2021-10-01T00:00:00.000Z',
      code: 'F2',
      productTypes: [
        {
          id: '2',
          name: 'Product 2',
          facilityDetailsId: '2',
          createdAt: '2021-10-01T00:00:00.000Z',
          updatedAt: '2021-10-01T00:00:00.000Z'
        }
      ]
    },
    {
      id: '3',
      name: 'Farm 3',
      address: 'Address 3',
      createdAt: '2021-10-01T00:00:00.000Z',
      updatedAt: '2021-10-01T00:00:00.000Z',
      code: 'F3',
      productTypes: [
        {
          id: '3',
          name: 'Product 3',
          facilityDetailsId: '3',
          createdAt: '2021-10-01T00:00:00.000Z',
          updatedAt: '2021-10-01T00:00:00.000Z'
        }
      ]
    }
  ];

  return (
    <>
      <div className="mt-6 flex gap-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a farm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a farm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a farm" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
