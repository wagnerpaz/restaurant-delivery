export default function toPascalCase(str: string) {
  // Split the string by whitespace, underscore, or hyphen characters
  const words = str.split(/[\s_-]+/);

  // Map over the words and capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the capitalized words back together with spaces between them
  const pascalCase = capitalizedWords.join(" ");

  return pascalCase;
}
