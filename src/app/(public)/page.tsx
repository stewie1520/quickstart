"use client";

import { FileSystemItem, readDirectory } from "@/lib/filesystem";
import Image from "next/image";
import { useState } from "react";
import { CodePanel } from "./_components/code-panel";
import { ModelSettings } from "./_components/model-settings";
import { SideBar } from "./_components/side-bar";
import { CodeChat } from "./_components/code-chat";
import { TextFileService } from "@/services/text-file.service";

export default function Page() {
  const [directoryTree, setDirectoryTree] = useState<FileSystemItem | null>(null)
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; content: string | null }>({ path: '', name: '', content: null })

  const handleFolderSelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker()
      const tree = await readDirectory(dirHandle)
      setDirectoryTree(tree)
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const handleFileSelect = async (item: FileSystemItem) => {
    try {
      const fileHandle = item.handle as FileSystemFileHandle
      const file = await fileHandle.getFile()
      const ext = fileHandle.name.split('.').pop()?.toLowerCase()

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
        setSelectedFile({ path: '', name: fileHandle.name, content: URL.createObjectURL(file) });
        return
      }

      const content = await file.text()
      const selectedFile = { path: item.path ?? item.name, name: fileHandle.name, content }
      setSelectedFile(selectedFile)
      TextFileService.openFile(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error)
      setSelectedFile({ path: '',  name: item.name, content: 'Error reading file content.' })
      TextFileService.closeFile();
    }
  }

  return (
    <div className="flex h-screen">
    {directoryTree && <SideBar item={directoryTree} onFileSelect={handleFileSelect}/>}
    <main className="flex-1 p-4 overflow-auto h-full">
      {!directoryTree ? (
        <div className="flex items-center justify-center h-full">
          <ModelSettings onFolderSelect={handleFolderSelect}/>
        </div>
      ) : (
        <>
          {selectedFile.name
            ? (
              <>
                <CodePanel file={selectedFile}/>
                <CodeChat />
              </>
            ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Image src="/images/ollama.png" width={80} height={112} alt={""} />
              <h3 className="text-xl font-semibold text-neutral-500 mt-4">Select a file to start chatting</h3>
              <p className="text-gray-500">
                Press&nbsp;
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>P
                </kbd> to search for a file
              </p>

              <p className="text-gray-500">
                Press&nbsp;
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>M
                </kbd> to change the model settings
              </p>
            </div>
          )}
        </>
      )}
    </main>
  </div>
  )
}