/**
 * Implements the frontend half of the two-tier cache (spec sections 6, 24):
 *
 *   Run pressed → fingerprint(code) → same as last run? → skip network,
 *   reuse last result. Different? → POST /api/compile (backend has its
 *   own fingerprint cache as a second layer).
 *
 * Usage in Playground.tsx's Run handler:
 *
 *   const client = useRef(createCompileClient()).current;
 *   const result = await client.run(code);
 *   // result.cached tells you whether this came back without a
 *   // network round trip at all (frontend hit) — useful for skipping
 *   // the "Compiling…" state per spec section 20.
 */

import { fingerprintMrCode } from "./fingerprint";

export interface CompileResult {
    success: boolean;
    output: string;
    error: string | null;
    exitCode: number | null;
    cached: boolean;
    fingerprint: string;
    executionTime?: number;
}

export interface CompileClient {
    /** Runs code through the cache-then-backend flow. */
    run(code: string): Promise<CompileResult>;
    /** Clears remembered last-fingerprint/result (e.g. on "Reset"). */
    reset(): void;
}

export function createCompileClient(
    endpoint: string = "/api/compile",
): CompileClient {
    let lastFingerprint: string | null = null;
    let lastResult: CompileResult | null = null;

    return {
        async run(code: string): Promise<CompileResult> {
            const fp = await fingerprintMrCode(code);

            if (fp === lastFingerprint && lastResult) {
                // Formatting-only edit since the last run — no network call.
                return { ...lastResult, cached: true, fingerprint: fp };
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                throw new Error(
                    `Compile request failed with status ${response.status}`,
                );
            }

            const result: CompileResult = await response.json();

            lastFingerprint = fp;
            lastResult = result;

            return result;
        },

        reset(): void {
            lastFingerprint = null;
            lastResult = null;
        },
    };
}
