import { z } from "zod";

/**
 * Zod schema for simple question-based interaction with Demitrei.
 */
export const askSchema = z.object({
  question: z.string().min(1, "Question cannot be empty").max(1000, "Question is too long"),
});
