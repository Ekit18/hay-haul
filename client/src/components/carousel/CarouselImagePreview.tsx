import { cn } from '@/lib/utils';
import { FileObject } from '../drag-and-drop/file-object.type';
import { Card, CardContent } from '../ui/card';

export type CarouselImagePreviewProps = {
  index: number;
  photo: FileObject;
  onClick: (index: number) => void;
  isActive: boolean;
};

export function CarouselImagePreview({ index, photo, onClick, isActive }: CarouselImagePreviewProps) {
  return (
    <Card
      className={cn('w-16 h-16 cursor-pointer p-2', isActive && 'border-2 border-primary')}
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
