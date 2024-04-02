import { Loader2 } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
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
          <PhotoProvider
            speed={() => 150}
            loadingElement={<Loader2 className="size-10 animate-spin text-white" color="white" />}
          >
            <PhotoView src={photo.preview}>
              <img
                src={photo.preview}
                alt="product"
                className="h-60 w-full object-cover"
                onLoad={() => URL.revokeObjectURL(photo.preview)}
              />
            </PhotoView>
          </PhotoProvider>
          {children}
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
