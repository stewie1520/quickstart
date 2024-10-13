import { BehaviorSubject } from "rxjs";
import { WithOutNextComplete } from "@/types/rxjs";

export class TextFileService {
  private static _openingFile$ = new BehaviorSubject<{ path: string, name: string, content: string } | null>(null);
  public static readonly openingFile$ = this._openingFile$ as WithOutNextComplete<typeof this._openingFile$>;

  static openFile(file: { path: string, name: string, content: string }) {
    this._openingFile$.next(file);
  }

  static closeFile() {
    this._openingFile$.next(null);
  }
}