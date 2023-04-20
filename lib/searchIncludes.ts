import removeDiacritics from "./removeDiacritics";

export default function searchIncludes(content?: string, includes?: string) {
  return removeDiacritics(content || "")
    .toLowerCase()
    .includes(removeDiacritics(includes || "").toLowerCase());
}
