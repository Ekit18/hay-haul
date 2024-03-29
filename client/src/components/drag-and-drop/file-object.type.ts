type FileObject = {
  id: string;
  webkitRelativePath: File['webkitRelativePath'];
  arrayBuffer: ReturnType<File['arrayBuffer']>;
  name: File['name'];
  size: File['size'];
  type: File['type'];
  preview: string;
};

export { type FileObject };
