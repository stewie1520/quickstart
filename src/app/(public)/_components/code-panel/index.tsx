import CodeMirrorEditor, { EditorSettings } from "@/components/codemirror/CodeMirrorEditor";

const editorSettings: EditorSettings = { tabSize: 2 };

type Props = {
  file: { name: string; content: string | null };
}

export const CodePanel = ({ file }: Props) => {
  const renderFileContent = () => {
    if (!file.content) return null

    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension || '')) {
      return <img src={file.content} alt={file.name} className="max-w-full max-h-[calc(100vh-200px)]" />
    }

    if (['mp4', 'webm', 'ogg'].includes(fileExtension || '')) {
      return <video src={URL.createObjectURL(new Blob([file.content]))} controls className="max-w-full max-h-[calc(100vh-200px)]" />
    }

    return (
      <div className="flex-1 h-full overflow-visible">
        <CodeMirrorEditor
          theme="light"
          settings={editorSettings}
          autoFocusOnDocumentChange
          doc={{
            value: file.content,
            isBinary: false,
            filePath: file.name,
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{file.name}</h2>
      {renderFileContent()}
    </div>
  )
}
