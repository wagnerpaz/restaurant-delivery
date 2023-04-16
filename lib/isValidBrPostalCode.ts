export default function isValidBRPostalCode(postalCode: string) {
  return /^[0-9]{5}-[0-9]{3}$/.test(postalCode);
}
