import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = (
  price: number | string | null | undefined,
  currency: string,
  dash?: string
): string => {
  // Handle cases where price is null or undefined
  if (price === null || price === undefined) {
    if (dash) {
      return dash ?? "−-";
    } else {
      return "--"; // Or any other appropriate value or behavior
    }
  }

  // Convert price to number if it's a string
  let priceValue: number =
    typeof price === "string" ? parseFloat(price) : price;

  // Check if price is a valid number
  if (Number.isNaN(priceValue)) {
    priceValue = 0;
  }

  // Format the price with currency symbol
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency, // Pass 'INR' for Indian Rupee or any other currency
    currencyDisplay: "symbol", // Use currency symbol (₹)
  });

  // Format the price as currency
  const formattedPrice: string = formatter.format(priceValue);

  // Insert space between currency symbol and value if necessary
  const spaceSeparatedPrice: string = formattedPrice.replace(
    /(\D)(\d)/,
    (match, symbol, value) => `${symbol}${value}`
  );

  return spaceSeparatedPrice;
};

export const capitalizeString = (
  inputString: string | null | undefined,
  dash?: string
): string => {
  if (!inputString) {
    return dash ?? "--"; // Return empty string if inputString is null or undefined
  }

  const words = inputString.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }

  return words.join(" ");
};
