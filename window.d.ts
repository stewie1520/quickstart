interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>
}

interface FileSystemDirectoryHandle {
  name: string
  kind: string
  getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>
  values(): AsyncIterableIterator<FileSystemHandle>
}

interface FileSystemHandle {
  kind: string
  getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>
  getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>
  removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>
  resolve(possibleDescendant: FileSystemHandle): Promise<FileSystemHandle>
  values(): AsyncIterableIterator<FileSystemHandle>
  getFile(): Promise<File>
}