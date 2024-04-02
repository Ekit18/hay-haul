import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export type CarouselImagePreviewProps = {
  onClick: () => void;
  isActive: boolean;
};

export function CarouselImageAdd({ onClick, isActive }: CarouselImagePreviewProps) {
  return (
    <Card
      className={cn('h-16 w-16 cursor-pointer border-2 border-dashed border-gray-500', isActive && 'border-primary')}
      onClick={onClick}
    >
      <CardContent className="flex aspect-square items-center justify-center p-0 ">
        <Plus />
      </CardContent>
    </Card>
  );
}
