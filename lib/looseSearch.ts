import removeDiacritics from "./removeDiacritics";

export default function looseSearch(context: string, term: string) {
  if (!term) return true;

  return removeDiacritics(context)
    .toLowerCase()
    .includes(removeDiacritics(term).toLocaleLowerCase());
}
