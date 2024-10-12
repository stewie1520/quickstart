'use client'

import { useState } from 'react'
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react'

export type FileSystemItem = {
  name: string
  kind: 'file' | 'directory'
  children?: FileSystemItem[]
}

export const DirectoryTree = ({ item, level = 0 }: { item: FileSystemItem; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <div className="ml-4">
      <div className="flex items-center gap-1">
        {item.kind === 'directory' && (
          <button onClick={toggleOpen} className="p-1">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {item.kind === 'directory' ? (
          <Folder className="w-4 h-4 text-yellow-500" />
        ) : (
          <File className="w-4 h-4 text-gray-500" />
        )}
        <span>{item.name}</span>
      </div>
      {item.kind === 'directory' && isOpen && (
        <div className="ml-4">
          {item.children?.map((child, index) => (
            <DirectoryTree key={`${child.name}-${index}`} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
