/**
 * Canonical fingerprinting for .mr source code (mirrors app/fingerprint.py
 * on the backend).
 *
 * Reuses the existing `parseCodeSpans` lexer from `syntax.tsx` — the same
 * classifier that already drives syntax highlighting — instead of writing
 * a second, possibly-inconsistent tokenizer. Comments and pure whitespace
 * spans are dropped; every other span (strings, numbers, identifiers,
 * operators, punctuation) is kept as a token, in order.
 *
 * The frontend and backend fingerprints don't need to be byte-identical —
 * each cache only ever compares fingerprints computed by itself — but
 * keeping the two canonicalization algorithms conceptually aligned makes
 * behavior easy to reason about and debug.
 */

import { parseCodeSpans } from "./syntax";

// Spans that carry no executable meaning: comments, and whitespace/
// unclassified text (parseCodeSpans emits these with className === "").
const IGNORED_SPAN_CLASSES = new Set(["syntax-comment", ""]);

// Separator that cannot appear inside any token produced by the lexer,
// so token-boundary information survives the join (avoids "ab"+"c"
// colliding with "a"+"bc").
const TOKEN_SEPARATOR = "\u0001";

export function canonicalizeMrCode(code: string): string {
    const spans = parseCodeSpans(code);
    const tokens: string[] = [];

    for (const span of spans) {
        if (IGNORED_SPAN_CLASSES.has(span.className)) continue;
        tokens.push(span.text);
    }

    return tokens.join(TOKEN_SEPARATOR);
}

/** SHA-256 hex digest of the canonical token sequence. */
export async function fingerprintMrCode(code: string): Promise<string> {
    const canonical = canonicalizeMrCode(code);
    const bytes = new TextEncoder().encode(canonical);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
