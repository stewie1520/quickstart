import { Popover } from "@/components/ui/popover"
import { PropsWithChildren } from "react"

export const Root = ({ children }: PropsWithChildren) => {
  return (
    <Popover>
      {children}
    </Popover>
  )
}