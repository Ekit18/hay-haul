import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RegisterableRoles, UserRole } from '@/lib/enums/user-role.enum';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { SignUpFormValues } from '../validation';

type RoleInfo = {
  value: RegisterableRoles;
  name: string;
  description: string;
};

const rolesInfo: RoleInfo[] = [
  {
    value: UserRole.Farmer,
    name: 'Farmer',
    description: 'Sell farm production to customers who need it'
  },
  {
    value: UserRole.Businessman,
    name: 'Businessman',
    description: 'Searching for farmer production and want to buy it'
  },
  {
    value: UserRole.Carrier,
    name: 'Carrier',
    description: 'I have a transportation company, and i want to offer transportation services'
  }
];

export function ChoseRole() {
  const { control } = useFormContext<SignUpFormValues>();

  return (
    <div className="w-full h-full">
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="gap-4 flex flex-col">
                {rolesInfo.map((role) => (
                  <FormItem
                    key={role.value}
                    className={cn(
                      'flex flex-col items-start space-x-6 space-y-0 gap-2 border p-2 rounded-md border-secondary',
                      field.value === role.value && 'shadow-custom border-primary'
                    )}
                  >
                    <div className="flex gap-2">
                      <FormControl>
                        <RadioGroupItem value={role.value} />
                      </FormControl>
                      <FormLabel className="font-normal">{role.name}</FormLabel>
                    </div>
                    <FormDescription>{role.description}</FormDescription>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
