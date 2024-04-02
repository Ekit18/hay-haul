import { Card, CardContent } from '../ui/card';
import { CarouselItem } from '../ui/carousel';
import { PreviewObject } from './FileInputCarousel';

interface CarouselImageItemProps {
  photo: PreviewObject;
  children?: React.ReactNode;
}

export function CarouselImageItem({ photo, children }: CarouselImageItemProps) {
  return (
    <CarouselItem key={photo.preview}>
      <Card>
        <CardContent className="relative mb-4 flex aspect-square items-center justify-center p-6">
          <img
            src={photo.preview}
            alt="product"
            className="h-60 w-full object-cover"
            onLoad={() => URL.revokeObjectURL(photo.preview)}
          />
          {children}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
