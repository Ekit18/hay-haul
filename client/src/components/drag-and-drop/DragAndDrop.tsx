import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MAX_FILE_SIZE } from '@/lib/constants/constants';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import React, { useEffect } from 'react';
import { FileError, useDropzone } from 'react-dropzone';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CreateProductAuctionFormValues } from '../product-auction/create-product-auction/validation';
import { FileObject } from './file-object.type';

function fileDimensionsValidator(file: File): Promise<FileError | null> {
  return new Promise((resolve) => {
    if (file instanceof DataTransferItem) {
      resolve(null);
    }

    const image = new Image();
    const imageSrc = URL.createObjectURL(file);
    image.src = imageSrc;

    image.onload = () => {
      const { width } = image;
      const { height } = image;

      if (width < 400 || height < 400) {
        resolve({
          code: 'image-too-small',
          message: `Image is smaller than 400x400`
        });
      }

      const aspectRatio = width / height;
      if (aspectRatio < 0.9 || aspectRatio > 1.1) {
        resolve({
          code: 'image-not-square',
          message: `Image is not square enough`
        });
      }

      URL.revokeObjectURL(imageSrc);
      resolve(null);
    };
  });
}

export function DragAndDrop() {
  const {
    control,
    setError,
    clearErrors,
    formState: { errors }
  } = useFormContext<CreateProductAuctionFormValues>();

  const {
    fields: photos,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'photos'
  });

  const onDrop = (acceptedFiles: File[]) => {
    const newPhotosLength = acceptedFiles.length + photos.length;
    if (newPhotosLength > 5) {
      setError('photos', {
        message: 'You can only upload 5 photos',
        type: 'manual'
      });

      const excess = newPhotosLength - 5;
      if (excess > 0) {
        acceptedFiles.splice(5 - photos.length, excess);
      }
    }

    acceptedFiles.forEach(async (file: File) => {
      const validationResult = await fileDimensionsValidator(file);

      if (validationResult) {
        setError('photos', {
          message: validationResult.message,
          type: 'manual'
        });
        return;
      }

      append({
        webkitRelativePath: file.webkitRelativePath,
        arrayBuffer: file.arrayBuffer(),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file)
      } as FileObject);
    });
  };

  const { getRootProps, getInputProps, fileRejections, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    minSize: 0,
    maxSize: MAX_FILE_SIZE
  });

  useEffect(() => {
    // return () => photo && URL.revokeObjectURL(photo.preview);
    return () => photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
  }, [photos]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              `border-dashed border-2
            border-gray-500 dark:border-gray-300
            rounded-md h-40 flex items-center justify-center flex-col gap-4 px-4 cursor-pointer
            w-56
            `,
              isDragActive && 'border-primary dark:border-primary',
              isDragReject && 'border-red-500 dark:border-red-300'
            )}
          >
            {!isDragActive && <Upload className="h-10 w-10 text-gray-500 dark:text-gray-300" />}
            <Input type="file" {...getInputProps()} />
            <p className={cn('text-gray-500 dark:text-gray-300', isDragActive && 'text-primary')}>
              {isDragActive ? 'Drop here' : 'Click or drag & drop to upload images'}
            </p>
          </div>
        </CardContent>
      </Card>
      {errors.photos && <FormMessage>{errors.photos.message}</FormMessage>}
      {fileRejections.map(({ errors }) => (
        <React.Fragment key={errors[0].message}>
          {errors.map((e) => (
            <FormMessage key={e.message}>{e.message}</FormMessage>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
