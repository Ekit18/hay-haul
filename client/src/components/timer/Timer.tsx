import { cn } from '@/lib/utils';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ClassNameValue } from 'tailwind-merge';

type TimerProps = {
  toDate: string;
  className?: ClassNameValue;
};

export function Timer({ toDate, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const end = new Date(toDate);
      const diffInSeconds = differenceInSeconds(end, now);

      if (diffInSeconds <= 0) {
        clearInterval(intervalId);
        setTimeLeft('Auction ended');
        return;
      }

      const days = differenceInDays(end, now);
      const hours = differenceInHours(end, now) % 24;
      const minutes = differenceInMinutes(end, now) % 60;
      const seconds = diffInSeconds % 60;
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [toDate]);

  return (
    <div className={cn('flex flex-row items-center gap-1 font-medium justify-center', className)}>
      <Clock className="h-5" />{' '}
      <span className={cn('min-w-32 h-6', !timeLeft && 'blur-sm')}>{timeLeft || '0d 00h 00m 00s'}</span>
    </div>
  );
}
