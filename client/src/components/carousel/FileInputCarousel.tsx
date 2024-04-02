import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import { CarouselImageAdd } from './CarouselImageAdd';
import { CarouselImageItem } from './CarouselImageItem';
import { CarouselImageWithDelete } from './CarouselImageItemWithDelete';
import { CarouselImagePreview } from './CarouselImagePreview';
import { DragAndDropCarouselItem } from './DragAndDropCarouselItem';

export type PreviewObject = {
  preview: string;
};

interface FileInputCarouselProps {
  items: PreviewObject[];
  hasAddButton?: boolean;
}

export function ImageCarousel({ items, hasAddButton }: FileInputCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

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

  const CarouselItem = hasAddButton ? CarouselImageWithDelete : CarouselImageItem;

  return (
    <div className="w-full flex-col items-center sm:px-16">
      <div className="flex flex-col items-center">
        <Carousel setApi={setApi} className="w-full max-w-xs">
          <CarouselContent>
            {items?.map((item) => <CarouselItem key={item.preview} photo={item} />)}
            {hasAddButton && items.length < 5 && <DragAndDropCarouselItem />}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {items?.map((item, index) => (
          <CarouselImagePreview
            key={item.preview}
            isActive={index === current - 1}
            photo={item}
            index={index}
            onClick={handlePreviewClick}
          />
        ))}
        {hasAddButton && items.length < 5 && (
          <CarouselImageAdd
            isActive={current === items.length + 1}
            onClick={() => handlePreviewClick(items.length + 1)}
          />
        )}
      </div>
    </div>
  );
}
