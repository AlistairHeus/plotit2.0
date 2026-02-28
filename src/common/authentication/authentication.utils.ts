// Define regex at module level for better performance
const EXPIRY_REGEX = /^(\d+)([dhm])$/;

/**
 * Parses expiry time string and converts to milliseconds
 * @param expiry - Expiry string in format like "15m", "7d", "2h"
 * @returns Expiry time in milliseconds
 */
export function parseExpiryTime(expiry: string): number {
  const match = EXPIRY_REGEX.exec(expiry);
  if (!match?.[1]) {
    throw new Error("Invalid expiry format");
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000; // days to milliseconds
    case "h":
      return value * 60 * 60 * 1000; // hours to milliseconds
    case "m":
      return value * 60 * 1000; // minutes to milliseconds
    default:
      throw new Error("Invalid expiry unit");
  }
}
