'use client'

import { useState } from 'react'
import { FileSystemItem } from '../../lib/filesystem'
import { ItemDirectory } from './item-directory'
import { ItemFile } from './item-file'

export const DirectoryTree = ({ 
  item, 
  level = 0, 
  onFileSelect ,
  expanded = false,
}: { 
  item: FileSystemItem
  level?: number
  expanded?: boolean
  onFileSelect: (file: FileSystemItem) => void 
}) => {
  const [isOpen, setIsOpen] = useState(expanded)

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleClick = () => {
    if (item.kind === 'directory') {
      toggleOpen()
    } else if (item.kind === 'file' && item.handle) {
      onFileSelect(item)
    }
  }

  return (
    <div className="">
      <ItemDirectory item={item} isOpen={isOpen} onClick={handleClick} />
      <ItemFile item={item} onClick={handleClick} />
      {item.kind === 'directory' && isOpen && (
        <div className="ml-4">
          {item.children?.map((child, index) => (
            <DirectoryTree 
              key={`${child.name}-${index}`} 
              item={child} 
              level={level + 1} 
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}