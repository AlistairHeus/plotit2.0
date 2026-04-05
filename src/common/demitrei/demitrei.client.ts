

/**
 * Low-level HTTP Client for Demitrei.
 * Handles base URLs, standard headers, timeouts, and JSON parsing.
 */
export class DemitreiApiClient {
    private readonly baseURL: string;

    constructor() {
        const url = process.env.DEMITREI_API_URL;
        if (!url) {
            throw new Error("DEMITREI_API_URL must be defined in environment");
        }
        // Ensure no trailing slashes for clean endpoint concatenations
        this.baseURL = url.replace(/\/$/, ""); 
    }

    private async request(endpoint: string, options: RequestInit): Promise<void> {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers = new Headers(options.headers);
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        const response = await fetch(url, {
            ...options,
            headers,
            // Fallback timeout if none provided (10s default)
            signal: options.signal ?? AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${String(response.status)}: ${errorText}`);
        }
    }

    /**
     * Executes a POST request to Demitrei.
     */
    async post(endpoint: string, body: unknown): Promise<void> {
        await this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    /**
     * Executes a DELETE request to Demitrei.
     */
    async delete(endpoint: string): Promise<void> {
        await this.request(endpoint, {
            method: "DELETE",
        });
    }
}

export const demitreiApiClient = new DemitreiApiClient();
