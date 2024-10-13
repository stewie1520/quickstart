import { FileSystemItem } from "@/lib/filesystem"
import { File } from "lucide-react"
import { useMemo } from "react"
import { getIcon } from "@/lib/file-icons"

export const ItemFile = ({ item, onClick }: {
  item: FileSystemItem,
  onClick: () => void
}) => {
  const fileIconUrl = useMemo(() => {
    if (item.kind === 'file') {
      return getIcon(item.name);
    }
    return undefined;
  }, [item])

  return item.kind === 'file' ? (
    <div 
      className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 p-1 rounded"
      onClick={onClick}
    >
      {fileIconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fileIconUrl} className="size-4 flex-shrink-0" draggable={false} alt="icon" />
      ) : (
        <File className="size-4 text-gray-500 flex-shrink-0" />
      )}

      <span>{item.name}</span>
    </div>
  ) : null
}