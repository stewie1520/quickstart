import { FileSystemItem } from "@/lib/filesystem"
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"

export const ItemDirectory = ({ item, isOpen, onClick }: {
  item: FileSystemItem,
  isOpen: boolean,
  onClick: () => void
}) => {
  return item.kind === 'directory' ? (
    <div 
      className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 p-1 rounded"
      onClick={onClick}
    >
      <span className="p-1">
        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </span>

      {isOpen ? (
        <FolderOpen className="size-4 text-yellow-500 flex-shrink-0" />
      ) : (
        <Folder className="size-4 text-yellow-500 flex-shrink-0" />
      )}
      <span>{item.name}</span>
    </div>
  ) : null
}
