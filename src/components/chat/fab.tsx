import { Stars } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"

export const FAB = () => {
  return (
    <div className="fixed right-10 bottom-10">
      <PopoverTrigger>
        <Button className="rounded-full size-12">
          <Stars />
        </Button>
      </PopoverTrigger>
    </div>
  )
}
