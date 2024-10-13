import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useBehaviorMapper } from "@/hooks";
import { ModelService } from "@/services/model.service";

type Props = {
  onFolderSelect: () => void;
}

export function ModelSettings({ onFolderSelect }: Props) {
  const models = useBehaviorMapper(ModelService.models$);
  const selectedModel = useBehaviorMapper(ModelService.selectedModel$);

  useEffect(() => {
    ModelService.fetchModels()
  }, [])

  const handleSelectProject = () => {
    onFolderSelect()
  }

  const handleChangeModel = (modelName: string) => {
    const model = models.find((model) => model.name === modelName) ?? null;
    if (!model) return;
    ModelService.selectModel(model);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-2 items-baseline">
            <Image src="/images/ollama.png" alt="Ollama" width={24} height={30}/>
            Ollama Settings
          </div>
        </CardTitle>
        <CardDescription>
          Configure the settings for your model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                readOnly
                defaultValue="http://127.0.0.1:11434"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Model</Label>
              <Select value={selectedModel?.name} onValueChange={handleChangeModel}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button disabled={!selectedModel} className="w-full" onClick={handleSelectProject}>Select Project</Button>
      </CardFooter>
    </Card>
  )
}
