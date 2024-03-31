import { Trash } from 'lucide-react';
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FileObject } from '../drag-and-drop/file-object.type';
import { CreateProductAuctionFormValues } from '../product-auction/create-product-auction/validation';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CarouselItem } from '../ui/carousel';

export type CarouselImageInputItemProps = { photo: FileObject };

export function CarouselImageInputItem({ photo }: CarouselImageInputItemProps) {
  const { control, clearErrors } = useFormContext<CreateProductAuctionFormValues>();

  const { fields: photos, remove } = useFieldArray({ control, name: 'photos' });

  const handleDeleteFile = useCallback(() => {
    const index = photos.findIndex((item) => item.preview === photo.preview);
    remove(index);
    clearErrors('photos');
  }, [remove, photos, clearErrors]);

  return (
    <CarouselItem key={photo.preview}>
      <Card>
        <CardContent className="flex relative aspect-square items-center justify-center p-6 mb-4">
          <img
            src={photo.preview}
            alt="product"
            className="w-full h-60 object-cover"
            onLoad={() => URL.revokeObjectURL(photo.preview)}
          />
          <Button
            className="absolute right-2 top-2 rounded-full p-4 h-4 w-4"
            type="button"
            variant="destructive"
            onClick={handleDeleteFile}
          >
            <Trash className="fixed" size={16} />
          </Button>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
