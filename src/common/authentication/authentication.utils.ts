// Define regex at module level for better performance
const EXPIRY_REGEX = /^(\d+)([dhms])?$/;

/**
 * Parses expiry time string and converts to milliseconds
 * @param expiry - Expiry string in format like "15m", "7d", "2h", or purely numeric for seconds
 * @returns Expiry time in milliseconds
 */
export function parseExpiryTime(expiry: string | number): number {
  if (typeof expiry === 'number') {
    return expiry * 1000;
  }

  const match = EXPIRY_REGEX.exec(expiry.trim());
  if (!match?.[1]) {
    throw new Error("Invalid expiry format");
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2] ?? "s"; // Default to seconds if no unit provided

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000; // days to milliseconds
    case "h":
      return value * 60 * 60 * 1000; // hours to milliseconds
    case "m":
      return value * 60 * 1000; // minutes to milliseconds
    case "s":
      return value * 1000; // seconds to milliseconds
    default:
      throw new Error("Invalid expiry unit");
  }
}
