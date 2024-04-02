import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { PreviewObject } from './FileInputCarousel';

export type CarouselImagePreviewProps = {
  index: number;
  photo: PreviewObject;
  onClick: (index: number) => void;
  isActive: boolean;
};

export function CarouselImagePreview({ index, photo, onClick, isActive }: CarouselImagePreviewProps) {
  return (
    <Card
      className={cn('h-16 w-16 cursor-pointer p-2', isActive && 'border-2 border-primary')}
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
