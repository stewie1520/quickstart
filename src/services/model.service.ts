import ollama, { ModelResponse } from "ollama/browser";
import { BehaviorSubject } from "rxjs";
import { WithOutNextComplete } from "@/types/rxjs";

export class ModelService {
  private static readonly _models$ = new BehaviorSubject<ModelResponse[]>([]);
  public static readonly models$ = this._models$ as WithOutNextComplete<typeof this._models$>;

  private static _selectedModel$ = new BehaviorSubject<ModelResponse | null>(null);
  public static readonly selectedModel$ = this._selectedModel$ as WithOutNextComplete<typeof this._selectedModel$>;

  static async fetchModels() {
    const result = await ollama.list();
    this._models$.next(result.models);
  }

  static selectModel(model: ModelResponse) {
    this._selectedModel$.next(model);
  }
}
