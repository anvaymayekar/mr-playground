export function formatMrCode(code: string): string {
    const lines = code.split("\n");
    let indentLevel = 0;
    const indentStr = "  ";
    let inMultilineComment = false;

    const formattedLines = lines.map((rawLine) => {
        let line = rawLine.trim();

        if (inMultilineComment) {
            if (line.includes("*/")) {
                inMultilineComment = false;
            }
            return `${indentStr.repeat(indentLevel)} ${line}`;
        }

        if (line.startsWith("/*") && !line.includes("*/")) {
            inMultilineComment = true;
            return `${indentStr.repeat(indentLevel)}${line}`;
        }

        if (!line) return "";

        // Decrease indent if line starts with closing brace
        if (line.startsWith("}") || line.startsWith("]")) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        const currentIndent = indentLevel;

        // Count non-string braces
        let openCount = 0;
        let closeCount = 0;
        let inStr = false;
        let quote = "";

        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if ((ch === '"' || ch === "'") && line[i - 1] !== "\\") {
                if (!inStr) {
                    inStr = true;
                    quote = ch;
                } else if (quote === ch) {
                    inStr = false;
                }
            }
            if (!inStr) {
                if (ch === "{" || ch === "[") openCount++;
                if (ch === "}" || ch === "]") closeCount++;
            }
        }

        if (!line.startsWith("}") && !line.startsWith("]")) {
            indentLevel = Math.max(0, indentLevel + openCount - closeCount);
        } else {
            indentLevel = Math.max(0, currentIndent + openCount);
        }

        return `${indentStr.repeat(currentIndent)}${line}`;
    });

    return formattedLines.join("\n");
}
