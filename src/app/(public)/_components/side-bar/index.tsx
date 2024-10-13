import { DirectoryTree } from "@/components/directory-tree"
import { FileSystemItem } from "@/lib/filesystem";
import { cn } from "@/lib/utils";
import { FileSearchCommandPalette } from "../file-search-command-palete";

type Props = {
  item: FileSystemItem;
  onFileSelect: (file: FileSystemItem) => void;
  className?: string;
}

export const SideBar = ({ item, onFileSelect, className }: Props) => {
  return (
    <>
    <FileSearchCommandPalette item={item} onFileSelect={onFileSelect}/>
    <aside className={cn("w-64 bg-gray-100 p-4 overflow-auto", className)}>
      <DirectoryTree expanded item={item} onFileSelect={onFileSelect} />
    </aside>
    </>
  )
}