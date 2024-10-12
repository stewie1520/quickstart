"use client";

import { useState } from "react";
import { DirectoryTree, FileSystemItem } from "@/components/directory-tree";
import { Button } from '@/components/ui/button';

export default function Page() {
  const [directoryTree, setDirectoryTree] = useState<FileSystemItem | null>(null)

  const handleFolderSelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker()
      const tree = await readDirectory(dirHandle)
      setDirectoryTree(tree)
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const readDirectory = async (dirHandle: FileSystemDirectoryHandle): Promise<FileSystemItem> => {
    const children: FileSystemItem[] = []

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        children.push({ name: entry.name, kind: 'file' })
      } else if (entry.kind === 'directory') {
        if (entry.name.startsWith('.')) continue;
        if (entry.name === 'node_modules') continue;

        children.push(await readDirectory(entry as unknown as FileSystemDirectoryHandle))
      }
    }

    return {
      name: dirHandle.name,
      kind: 'directory',
      children: children.sort((a, b) => {
        if (a.kind === b.kind) return a.name.localeCompare(b.name)
        return a.kind === 'directory' ? -1 : 1
      }),
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4 overflow-auto">
        <Button onClick={handleFolderSelect} className="mb-4">
          Select Folder
        </Button>
        {directoryTree && <DirectoryTree item={directoryTree} />}
      </aside>
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Directory Tree Viewer</h1>
        <p>Select a folder to view its directory tree in the sidebar.</p>
      </main>
    </div>
  )
}