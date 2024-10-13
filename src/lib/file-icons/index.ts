import icons from "./icons.json";

const iconMaps = new Map<string, string>();

const init = () => {
  if (iconMaps.size) return;

  for (const icon of icons) {
    if (!icon.ext || !icon.url) continue;
    const exts = icon.ext.split(",");
    for (const ext of exts) {
      iconMaps.set(ext.trim(), icon.url);
    }
  }
}

export const getIcon = (filename: string) => {
  init();

  const [, ...parts] = filename.split(".");
  const [extensions] = parts.toReversed().reduce((acc, part) => {
    const path = acc[1] ? `${acc[1]}.${part}` : part;
    acc[0].push(path);
    acc[1] = path;
    return acc;
  }, [[], ''] as [string[], string]);
  
  for (const ext of extensions.toReversed()) {
    if (iconMaps.has(ext) || iconMaps.has('.' + ext)) {
      return iconMaps.get(ext) ?? iconMaps.get('.' + ext);
    }
  }
}