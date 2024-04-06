import { cn } from '@/lib/utils';

import { Card, CardContent } from '../ui/card';
import { PreviewObject } from './ImageCarousel';

export type CarouselImagePreviewProps = {
  index: number;
  photo: PreviewObject;
  onClick: (index: number) => void;
  isActive: boolean;
};

export function CarouselImagePreview({ index, photo, onClick, isActive }: CarouselImagePreviewProps) {
  return (
    <Card
      className={cn(
        'h-16 w-16 cursor-pointer border-0 p-2 ring-1 ring-gray-200',
        isActive && 'border-0 ring-2 ring-primary'
      )}
      onClick={() => onClick(index)}
    >
      <CardContent className="flex aspect-square items-center justify-center p-0">
        <img
          src={photo.preview}
          alt="product"
          className="h-full w-full object-cover"
          onLoad={() => URL.revokeObjectURL(photo.preview)}
        />
      </CardContent>
    </Card>
  );
}
