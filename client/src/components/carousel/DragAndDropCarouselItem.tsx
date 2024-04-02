import { Card, CardContent } from '@/components/ui/card';
import { CarouselItem } from '@/components/ui/carousel';
import { DragAndDrop } from '../drag-and-drop/DragAndDrop';

export function DragAndDropCarouselItem() {
  return (
    <CarouselItem key="input">
      <Card>
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <DragAndDrop />
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
