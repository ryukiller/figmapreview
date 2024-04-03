import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const formatEuro = (value) => {
  if (!value) return "";
  const number = parseFloat(value);
  if (isNaN(number)) return "";

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(number);
};

export default formatEuro;
