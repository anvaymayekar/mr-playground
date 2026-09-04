import { useMemo, type ReactNode } from "react";

export const modifiers = new Set([
    "he",
    "te",
    "maze",
    "lahan",
    "maha",
    "uch",
    "ahe",
]);
export const types = new Set([
    "ank",
    "akshar",
    "bhagank",
    "purnank",
    "vidhan",
    "nirank",
]);
export const controls = new Set([
    "jar",
    "nahitar",
    "anyatha",
    "jovar",
    "pratyek",
    "thamba",
    "pudhe",
    "partav",
    "paryay",
]);
export const functions = new Set(["karya", "leeh", "shevti"]);
export const booleans = new Set(["khare", "khote"]);
export const wordOperators = new Set(["ani", "va"]);
export const operators =
    /^(?:==|!=|<=|>=|<<|>>|\+\+|--|&&|\|\||[+\-*/%&|^~!<>=])$/;

export interface HighlightSpan {
    text: string;
    className: string;
}

export function classifyWord(word: string, afterWord: string): string {
    if (modifiers.has(word)) return "syntax-modifier";
    if (types.has(word)) return "syntax-type";
    if (controls.has(word)) return "syntax-control";
    if (functions.has(word) || /^\s*\(/.test(afterWord))
        return "syntax-function";
    if (booleans.has(word)) return "syntax-boolean";
    if (wordOperators.has(word)) return "syntax-operator";
    return "syntax-variable";
}

export function parseCodeSpans(code: string): HighlightSpan[] {
    const spans: HighlightSpan[] = [];
    const len = code.length;
    let i = 0;

    while (i < len) {
        // Multiline comment
        if (code[i] === "/" && code[i + 1] === "*") {
            const start = i;
            i += 2;
            while (i < len && !(code[i] === "*" && code[i + 1] === "/")) i++;
            if (i < len) i += 2;
            spans.push({
                text: code.slice(start, i),
                className: "syntax-comment",
            });
            continue;
        }

        // Single-line comment
        if (code[i] === "/" && code[i + 1] === "/") {
            const start = i;
            while (i < len && code[i] !== "\n") i++;
            spans.push({
                text: code.slice(start, i),
                className: "syntax-comment",
            });
            continue;
        }

        // Strings
        if (code[i] === '"' || code[i] === "'") {
            const quote = code[i];
            const start = i;
            i++;
            while (i < len && code[i] !== quote && code[i] !== "\n") {
                if (code[i] === "\\" && i + 1 < len) i++;
                i++;
            }
            if (i < len && code[i] === quote) i++;
            spans.push({
                text: code.slice(start, i),
                className: "syntax-string",
            });
            continue;
        }

        // Numbers
        if (/[0-9]/.test(code[i])) {
            const start = i;
            while (i < len && /[0-9.]/.test(code[i])) i++;
            spans.push({
                text: code.slice(start, i),
                className: "syntax-number",
            });
            continue;
        }

        // Identifiers / keywords
        if (/[A-Za-z_]/.test(code[i])) {
            const start = i;
            while (i < len && /[A-Za-z0-9_]/.test(code[i])) i++;
            const word = code.slice(start, i);
            const cls = classifyWord(word, code.slice(i, i + 8));
            spans.push({ text: word, className: cls });
            continue;
        }

        // Two-character operators
        const twoChar = code.slice(i, i + 2);
        if (operators.test(twoChar)) {
            spans.push({ text: twoChar, className: "syntax-operator" });
            i += 2;
            continue;
        }

        // Single-character operators
        if (operators.test(code[i])) {
            spans.push({ text: code[i], className: "syntax-operator" });
            i++;
            continue;
        }

        // Punctuation
        if (/[{}()[\];:,.]/.test(code[i])) {
            spans.push({ text: code[i], className: "syntax-punctuation" });
            i++;
            continue;
        }

        // Whitespace and unclassified text
        const start = i;
        while (
            i < len &&
            !/[A-Za-z0-9_{}()[\];:,.+\-*/%&|^~!<>"'/]/.test(code[i]) &&
            !(code[i] === "/" && (code[i + 1] === "/" || code[i + 1] === "*"))
        ) {
            i++;
        }
        spans.push({ text: code.slice(start, i), className: "" });
    }

    return spans;
}

export function HighlightedCode({
    code,
    className = "",
}: {
    code: string;
    className?: string;
}) {
    const spans = useMemo(() => parseCodeSpans(code), [code]);

    return (
        <code
            className={className}
            style={{ fontFamily: "inherit", fontKerning: "none" }}
        >
            {spans.map((span, idx) =>
                span.className ? (
                    <span key={idx} className={span.className}>
                        {span.text}
                    </span>
                ) : (
                    <span key={idx}>{span.text}</span>
                ),
            )}
        </code>
    );
}
