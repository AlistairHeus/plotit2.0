import { Router, type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "@/middleware/auth.middleware";
import { validateBody } from "@/middleware/validation.middleware";
import { askSchema } from "./demitrei.validation";
import type { z } from "zod";

const router = Router();

// Python service is on 8000. 
// Using 127.0.0.1 to avoid the 2-minute "localhost" DNS stall bug.
const PYTHON_API = "http://127.0.0.1:8000";

/**
 * Shared logic for proxying streams from Python to the client.
 */
async function proxyStream(path: string, body: object, res: Response, authHeader?: string) {
  console.log(`[Demitrei Proxy]: Hitting ${path}...`);

  const abortController = new AbortController();

  try {
    const response = await fetch(`${PYTHON_API}${path}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(authHeader ? { "Authorization": authHeader } : {})
      },
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const statusStr = String(response.status);
      console.error(`[Demitrei Proxy Error]: ${path} failed with ${statusStr}`, errorText);
      res.status(response.status).json({ message: "Demitrei API error", error: errorText });
      return;
    }

    // Essential SSE headers
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();

    if (!response.body) {
      res.status(500).json({ message: "Empty stream from Demitrei" });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let tokenCount = 0;

    for (; ;) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        if (tokenCount === 0) console.log(`[Demitrei Proxy]: First token received from ${path}`);
        tokenCount++;
        res.write(chunk);

        // If there's a flush method (from compression or similar), call it to force data out.
        const resWithFlush = res as Response & { flush?: () => void };
        if (typeof resWithFlush.flush === "function") {
          resWithFlush.flush();
        }
      }
    }

    res.end();
    console.log(`[Demitrei Proxy]: Finished ${path} stream.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Demitrei Proxy Error]: ${path} failed`, errorMessage);

    if (!res.headersSent) {
      res.status(500).json({ message: "Demitrei connection failed" });
    } else {
      res.end();
    }
  }
}

router.post(
  "/ask",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    console.log("\n[Demitrei Proxy]: POST /ask received");
    const { question } = validateBody<z.infer<typeof askSchema>>(req.body, askSchema);
    await proxyStream("/api/ask", { question }, res, req.headers.authorization);
  })
);
export default router;