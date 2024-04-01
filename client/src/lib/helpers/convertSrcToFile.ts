import { FileObject } from '@/components/drag-and-drop/file-object.type';
import { convertFileToFileObject } from './convertFileToFileObject';

export type ConvertSrcToFileParams = {
  id?: string;
  url: string;
  fileName: string;
  mimeType: string;
};
export const convertSrcToFile = async ({
  url,
  fileName,
  mimeType,
  id
}: ConvertSrcToFileParams): Promise<FileObject> => {
  const res = await fetch(url);
  const blob = await res.blob();
  const file = new File([blob], fileName, { type: mimeType });
  return convertFileToFileObject(file, id);
};
