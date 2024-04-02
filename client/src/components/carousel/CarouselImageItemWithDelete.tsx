import { Trash } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FileObject } from '../drag-and-drop/file-object.type';
import { Button } from '../ui/button';
import { CarouselImageItem } from './CarouselImageItem';
import { PreviewObject } from './FileInputCarousel';

interface CarouselImageInputItemProps {
  photo: PreviewObject;
}

export function CarouselImageWithDelete({ photo }: CarouselImageInputItemProps) {
  const { clearErrors, setValue, getValues } = useFormContext<{ photos: FileObject[] }>();

  const handleDeleteFile = () => {
    const photos = getValues('photos');

    setValue(
      'photos',
      photos.filter((item) => item.preview !== photo.preview)
    );

    clearErrors('photos');
  };

  return (
    <CarouselImageItem photo={photo}>
      <Button
        className="absolute right-2 top-2 h-4 w-4 rounded-full p-4"
        type="button"
        variant="destructive"
        onClick={handleDeleteFile}
      >
        <Trash className="fixed" size={16} />
      </Button>
    </CarouselImageItem>
  );
}
