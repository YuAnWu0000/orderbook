export function formatNumberWithCommas(input: undefined | number | string): string {
  if (input === undefined) return "--";
  const num = typeof input === "number" ? input.toString() : input;
  const [integerPart, decimalPart] = num.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}
