import { Trash } from 'lucide-react';
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CreateProductAuctionFormValues } from '../product-auction/create-product-auction/validation';
import { Button } from '../ui/button';
import { CarouselImageItem } from './CarouselImageItem';
import { PreviewObject } from './FileInputCarousel';

interface CarouselImageInputItemProps {
  photo: PreviewObject;
}

export function CarouselImageWithDelete({ photo }: CarouselImageInputItemProps) {
  const { control, clearErrors } = useFormContext<CreateProductAuctionFormValues>();

  const { fields: photos, remove } = useFieldArray({ control, name: 'photos' });

  const handleDeleteFile = useCallback(() => {
    const index = photos.findIndex((item) => item.preview === photo.preview);
    console.log(index);
    remove(index);
    clearErrors('photos');
  }, [remove, photos, clearErrors]);

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
