import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { differenceInMilliseconds, isPast } from 'date-fns';
import { useEffect, useState } from 'react';

interface TimeProgressProps {
  startDate: Date;
  endDate: Date;
}

export function TimeProgress({ startDate, endDate }: TimeProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPast(endDate)) {
        setProgress(100);
        clearInterval(interval);
        return;
      }

      const now = new Date();

      const total = Math.floor(differenceInMilliseconds(endDate, startDate));
      const elapsed = Math.floor(differenceInMilliseconds(now, startDate));

      setProgress(Math.floor((elapsed / total) * 100));
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return <Progress className={cn('h-2 bg-gray-200', !progress && 'blur')} value={!progress ? 50 : progress} />;
}
