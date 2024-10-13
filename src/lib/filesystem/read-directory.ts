export type FileSystemItem = {
  name: string
  path?: string
  kind: 'file' | 'directory'
  children?: FileSystemItem[]
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle
}

export const readDirectory = async (dirHandle: FileSystemDirectoryHandle): Promise<FileSystemItem> => {
  const children: FileSystemItem[] = []

  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      children.push({ name: entry.name, kind: 'file', handle: entry as unknown as FileSystemFileHandle })
    } else if (entry.kind === 'directory') {
      if (entry.name.startsWith('.')) continue;
      if (entry.name === 'node_modules') continue;
      if (entry.name === 'build') continue;
      if (entry.name === 'dist') continue;

      children.push(await readDirectory(entry as unknown as FileSystemDirectoryHandle))
    }
  }

  return {
    name: dirHandle.name,
    kind: 'directory',
    handle: dirHandle,
    children: children.sort((a, b) => {
      if (a.kind === b.kind) return a.name.localeCompare(b.name)
      return a.kind === 'directory' ? -1 : 1
    }),
  }
}

export const flattenFileItems = (item: FileSystemItem): FileSystemItem[] => {
  const items: FileSystemItem[] = []

  if (item.kind === 'directory') {
    item.children?.forEach(child => {
      if (child.kind === 'file') {
        items.push({
          ...child,
          path: item.path ? `${item.path}/${child.name}` : child.name,
          name: child.name,
        })
      } else if (child.kind === 'directory') {
        items.push(...flattenFileItems({
          ...child,
          path: item.path ? `${item.path}/${child.name}` : child.name,
        }))
      }
    });
  }

  return items
}

