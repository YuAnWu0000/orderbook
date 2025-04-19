export function formatNumberWithCommas(input: number | string): string {
  const num = typeof input === "number" ? input.toString() : input;
  const [integerPart, decimalPart] = num.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
