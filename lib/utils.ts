import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert the number to a string
}

export function isDateExpired(date: Date): boolean {
  const currentDate = new Date();
  return date.getTime() < currentDate.getTime();
}

export function formatNumber(number: number): string {
  // Create a NumberFormat instance with the appropriate options
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Format the number
  return formatter.format(number);
}
