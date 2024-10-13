import { User } from 'lucide-react'
import Image from 'next/image'
import { marked } from 'marked';
import Style from "./bubble.module.scss";

interface BubbleProps {
  message?: string
  thinking?: boolean
}

export const BubbleAI = ({ message }: BubbleProps) => {
  return (
    <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
      <span className="relative flex shrink-0 overflow-hidden rounded-full">
        <div className="rounded-full bg-gray-100 border p-1 size-8 flex items-center justify-center overflow-hidden">
          <Image src="/images/ollama.png" alt="AI" width={16} height={20} />
        </div>
      </span>
      <p className="leading-relaxed">
        <span className="block font-bold text-gray-700">Ollama</span>
        {message ? (
          <div dangerouslySetInnerHTML={{
            __html: marked.parse(message),
          }}></div>
        ) : (
          <div className={Style.ticontainer}>
            <div className={Style.tiblock}>
              <div className={Style.tidot}></div>
              <div className={Style.tidot}></div>
              <div className={Style.tidot}></div>
            </div>
          </div>
        )}
      </p>
    </div>
  )
}

export const BubbleUser = ({ message }: BubbleProps) => {
  return (
    <div className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
      <User className="size-8 flex-shrink-0" />
      <p className="leading-relaxed">
        <span className="block font-bold text-gray-700">You </span>
        {!!message && (
          <div dangerouslySetInnerHTML={{
            __html: marked.parse(message),
          }}></div>
        )}
      </p>
    </div>
  )
}