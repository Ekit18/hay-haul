import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { generatePassword } from '@/lib/helpers/generatePassword';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sparkles } from 'lucide-react';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { Driver } from '@/lib/types/Driver/Driver.type';

interface RegeneratePasswordInputProps {
  driver: Driver;
}

export function RegeneratePasswordInput({ driver }: RegeneratePasswordInputProps) {
  const [regenerateDriverPassword] = driverApi.useRegenerateDriverPasswordMutation();

  const [password, setPassword] = useState<string>('');

  const handleRegeneratePasswordClick = async () => {
    const password = generatePassword();
    setPassword(password);

    await regenerateDriverPassword({ driverId: driver.id, password })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Password regenerated',
          description: 'Password has been regenerated successfully.'
        });
      })
      .catch((error) => {
        handleRtkError(error);
      });
  };

  return (
    <>
      <FormItem className="w-full">
        <FormLabel className="block">Password</FormLabel>
        <FormControl>
          <div className="flex w-full [&_div]:w-full">
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full rounded-e-none"
              placeholder="Regenerate password"
              readOnly
            />
            <Button
              variant="outline"
              onClick={handleRegeneratePasswordClick}
              type="button"
              className="rounded-s-none border-l-0 px-2"
            >
              <Sparkles size={18} strokeWidth={1.5} />
            </Button>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </>
  );
}
