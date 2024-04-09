import { FileObject } from '@/components/drag-and-drop/FileObject.type';

export function convertFileToFileObject(file: File, id?: string): FileObject {
  return {
    id,
    webkitRelativePath: file.webkitRelativePath,
    arrayBuffer: file.arrayBuffer(),
    name: file.name,
    size: file.size,
    type: file.type,
    preview: URL.createObjectURL(file)
  } as FileObject;
}
