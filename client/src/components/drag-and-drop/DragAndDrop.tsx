import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MAX_FILES, MAX_FILE_SIZE } from '@/lib/constants/constants';
import { convertFileToFileObject } from '@/lib/helpers/convertFileToFileObject';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import React, { useEffect } from 'react';
import { FileError, useDropzone } from 'react-dropzone';
import { useFieldArray, useFormContext } from 'react-hook-form';
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
  } = useFormContext<{ photos: FileObject[] }>();

  const { fields: photos, append } = useFieldArray({
    control,
    name: 'photos'
  });

  const onDrop = (acceptedFiles: File[]) => {
    clearErrors('photos');

    const newPhotosLength = acceptedFiles.length + photos.length;
    if (newPhotosLength > MAX_FILES) {
      setError('photos', {
        message: `You can only upload ${MAX_FILES} photos`,
        type: 'manual'
      });

      acceptedFiles.splice(MAX_FILES - photos.length);
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

      append(convertFileToFileObject(file));
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
              `flex h-40
            w-56 cursor-pointer
            flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-500 px-4
            dark:border-gray-300
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
      <div className="mt-2 h-5">
        {errors.photos && <FormMessage>{errors.photos.message}</FormMessage>}
        {fileRejections.map(({ errors }) => (
          <React.Fragment key={errors[0].message}>
            {errors.map((e) => (
              <FormMessage key={e.message}>{e.message}</FormMessage>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
