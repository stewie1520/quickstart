import { FileSystemItem, flattenFileItems } from "@/lib/filesystem"
import Fuse from "fuse.js"
import { debounce } from "lodash"
import { FileIcon } from "lucide-react"
import * as React from "react"
import { useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogTitle } from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Command, CommandItem, CommandList } from "../../../../components/ui/command"
import { cn } from "../../../../lib/utils"
import { getIcon } from "../../../../lib/file-icons"

type Props = {
  item: FileSystemItem
  onFileSelect: (handle: FileSystemItem) => void
}

export function FileSearchCommandPalette({ item, onFileSelect }: Props) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [matches, setMatches] = React.useState<(FileSystemItem & { url?: string })[]>([])

  // Flatten the file system and memoize
  const files = React.useMemo(() => flattenFileItems(item), [item])

  // Initialize the fuzzy search with Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse(files, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [files]
  )

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      if (value.trim() === "") {
        setMatches([])
      } else {
        const result = fuse.search(value).slice(0, 10) // Limit results to 10
        setMatches(result.map(res => ({
          ...res.item,
          url: getIcon(res.item.name)
        })))
      }
    }, 300),
    [fuse]
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    debouncedSearch(value)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        return;
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const commandRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
   // check for up and down arrow keys
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      commandRef.current?.focus();
    }
  }

  const handleSelectFile = (file: FileSystemItem) => {
    onFileSelect(file);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent noOverlay className="overflow-hidden p-2 bg-gray-100 shadow-lg top-[50px] translate-y-0">
          <DialogTitle className="text-lg font-bold">🔍 Quick jump</DialogTitle>
          <div className="flex flex-col w-full gap-2">
            <Input
              className="focus-visible:ring-0 focus-visible:ring-offset-0" 
              onChange={e => handleSearch(e.target.value)}
              value={search}
              placeholder="Type a file name to search..."
              onKeyDown={handleKeyDown}
            />
            <Command ref={commandRef} className={cn("focus-visible:outline-none border", { 'hidden': !matches.length })}>
              <CommandList>
                {matches.map((file, index) => (
                  <CommandItem onSelect={() => handleSelectFile(file)} className="cursor-pointer rounded-sm hover:bg-neutral-100 p-1 flex items-center gap-2" key={index}>
                    {file.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.url} className="size-4 flex-shrink-0" draggable={false} alt="icon" />
                    ) : (
                      <FileIcon className="size-4" />
                    )}
                    <span className="">
                      {file.path}
                    </span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>  
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
