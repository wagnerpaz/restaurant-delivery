export default function applyCepMask(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const cep = event.target.value.replace(/\D/g, "");
  let maskedCep = cep.slice(0, 5);

  if (cep.length >= 6) {
    maskedCep += "-" + cep.slice(5, 8);
  } else {
    maskedCep += cep.slice(5);
  }

  return maskedCep;
}
