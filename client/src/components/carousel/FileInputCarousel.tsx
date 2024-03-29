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
import { CarouselImageAdd } from './CarouselImageAdd';
import { CarouselImageInputItem } from './CarouselImageInputItem';
import { CarouselImagePreview } from './CarouselImagePreview';

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
  }, [api, items]);

  const handlePreviewClick = (index: number) => {
    if (!api) {
      return;
    }
    api.scrollTo(index, true);
  };

  const dragDropItem = (
    <CarouselItem key="input">
      <Card>
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <DragAndDrop />
        </CardContent>
      </Card>
    </CarouselItem>
  );

  console.log(current, count, items.length);

  return (
    <div className="px-16 w-full flex-col items-center">
      <div className="flex flex-col items-center">
        <Carousel setApi={setApi} className="w-full max-w-xs">
          <CarouselContent>
            {items?.map((item) => <CarouselImageInputItem key={item.preview} photo={item} />)}
            {items.length < 5 && dragDropItem}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="flex mt-4 gap-4 justify-center">
        {items?.map((item, index) => (
          <CarouselImagePreview
            key={item.preview}
            isActive={index === current - 1}
            photo={item}
            index={index}
            onClick={handlePreviewClick}
          />
        ))}
        {items.length < 5 && (
          <CarouselImageAdd
            isActive={current === items.length + 1}
            onClick={() => handlePreviewClick(items.length + 1)}
          />
        )}
      </div>
      {/* <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div> */}
    </div>
  );
}
