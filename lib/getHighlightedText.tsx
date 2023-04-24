import removeDiacritics from "./removeDiacritics";
import searchIncludes from "./searchIncludes";

export default function getHighlightedText(text: string, highlight: string) {
  if (!text || !highlight) {
    return text;
  }
  // Split on highlight term and include term into parts, ignore case
  const parts = removeDiacritics(text)
    .toLowerCase()
    .split(new RegExp(`(${removeDiacritics(highlight).toLowerCase()})`, "gi"));

  let reconciliatedCurrIndex = 0;
  for (let partIndex = 0; partIndex < parts.length; partIndex++) {
    const part = parts[partIndex];
    const begin = reconciliatedCurrIndex;
    const end = (reconciliatedCurrIndex += part.length);
    parts[partIndex] = text.slice(begin, end);
  }
  return (
    <span>
      {" "}
      {parts.map((part, i) =>
        searchIncludes(part, highlight) ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}{" "}
    </span>
  );
}
