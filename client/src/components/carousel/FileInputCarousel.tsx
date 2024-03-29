import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { DragAndDrop } from '../drag-and-drop/DragAndDrop';
import { FileObject } from '../drag-and-drop/file-object.type';
import { CarouselImageInputItem } from './CarouselImageInputItem';

type Properties = {
  items: FileObject[];
};

export function FileInputCarousel({ items }: Properties) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const dragDropItem = (
    <CarouselItem key="input">
      <Card>
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <DragAndDrop />
        </CardContent>
      </Card>
    </CarouselItem>
  );

  return (
    <div>
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {items?.map((item) => <CarouselImageInputItem key={item.id} photo={item} />)}
          {dragDropItem}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div> */}
    </div>
  );
}
